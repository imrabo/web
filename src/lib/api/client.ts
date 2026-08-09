/**
 * API Client
 *
 * Responsibilities:
 * - Make HTTP requests to the FastAPI backend
 * - Attach the in-memory access token
 * - Send HttpOnly cookies
 * - Normalize API errors
 * - Automatically refresh the access token after a 401
 * - Retry the failed request once
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    version: string;
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'API_ERROR',
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * In-memory access token.
 *
 * Do NOT store the access token in localStorage.
 */
let accessToken: string | null = null;

export const tokenStore = {
  get(): string | null {
    return accessToken;
  },

  set(token: string): void {
    accessToken = token;
  },

  clear(): void {
    accessToken = null;
  },
};

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  data?: unknown;
  retry?: boolean;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly timeout = 30_000;

  private refreshPromise: Promise<string | null> | null = null;

  constructor(
    baseUrl: string =
      import.meta.env.VITE_PUBLIC_API_URL ??
      'http://localhost:8000/api/v1',
  ) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make an HTTP request.
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      method = 'GET',
      data,
      retry = true,
    } = options;

    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = tokenStore.get();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const requestOptions: RequestInit = {
      method,
      credentials: 'include',
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    if (data !== undefined && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, requestOptions);

      /**
       * Access token expired.
       *
       * Ask backend for a new access token using
       * the HttpOnly refresh-token cookie.
       */
      if (
        response.status === 401 &&
        retry &&
        !endpoint.includes('/auth/refresh')
      ) {
        const newToken = await this.refreshAccessToken();

        if (newToken) {
          return this.request<T>(endpoint, {
            ...options,
            retry: false,
          });
        }

        tokenStore.clear();
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const contentType =
        response.headers.get('content-type') ?? '';

      const body = contentType.includes('application/json')
        ? await response.json()
        : undefined;

      if (!response.ok) {
        throw this.createApiError(response, body);
      }

      /**
       * Backend uses:
       *
       * {
       *   success: true,
       *   data: ...
       * }
       */
      if (this.isApiResponse(body)) {
        if (!body.success) {
          throw new ApiError(
            body.error?.message ?? 'Request failed',
            response.status,
            body.error?.code ?? 'API_ERROR',
            body.error?.details,
          );
        }

        return body.data as T;
      }

      /**
       * Also support normal JSON responses.
       */
      return body as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new ApiError(
          'Request timed out',
          408,
          'REQUEST_TIMEOUT',
        );
      }

      throw new ApiError(
        error instanceof Error
          ? error.message
          : 'Network request failed',
        0,
        'NETWORK_ERROR',
      );
    }
  }

  /**
   * Refresh access token.
   *
   * The refresh token is stored in an HttpOnly cookie,
   * therefore the browser sends it automatically.
   */
  private async refreshAccessToken(): Promise<string | null> {
    /**
     * Prevent multiple simultaneous refresh requests.
     *
     * Example:
     *
     * Request A -> 401
     * Request B -> 401
     * Request C -> 401
     *
     * Only ONE refresh request should be sent.
     */
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(
          `${this.baseUrl}/auth/refresh`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          tokenStore.clear();
          return null;
        }

        const body = await response.json();

        const token =
          body.access_token ??
          body.data?.access_token;

        if (!token) {
          tokenStore.clear();
          return null;
        }

        tokenStore.set(token);

        return token;
      } catch {
        tokenStore.clear();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Determine whether response follows ApiResponse format.
   */
  private isApiResponse(
    body: unknown,
  ): body is ApiResponse {
    return (
      typeof body === 'object' &&
      body !== null &&
      'success' in body
    );
  }

  /**
   * Convert HTTP error response to ApiError.
   */
  private createApiError(
    response: Response,
    body: unknown,
  ): ApiError {
    if (this.isApiResponse(body)) {
      return new ApiError(
        body.error?.message ??
        response.statusText ??
        'Request failed',
        response.status,
        body.error?.code ?? 'HTTP_ERROR',
        body.error?.details,
      );
    }

    return new ApiError(
      response.statusText ||
      `HTTP ${response.status}`,
      response.status,
      'HTTP_ERROR',
    );
  }

  /**
   * GET
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  /**
   * POST
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      data,
    });
  }

  /**
   * PUT
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      data,
    });
  }

  /**
   * PATCH
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      data,
    });
  }

  /**
   * DELETE
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * GET with query parameters.
   */
  async getWithQuery<T>(
    endpoint: string,
    params?: Record<
      string,
      string | number | boolean | Date | null | undefined
    >,
  ): Promise<T> {
    if (!params) {
      return this.get<T>(endpoint);
    }

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        searchParams.set(key, String(value));
      }
    }

    const queryString = searchParams.toString();

    return this.get<T>(
      queryString
        ? `${endpoint}?${queryString}`
        : endpoint,
    );
  }
}

export const apiClient = new ApiClient();