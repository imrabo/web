export interface UserType {
  id: number;

  first_name: string;
  last_name: string;

  username: string;
  email: string;

  phone_number?: string | null;

  /**
   * Password hash should generally NOT be returned by the API.
   * It exists in the database model but should be excluded
   * from the API response.
   */
  password_hash?: string;

  created_by?: string | null;
  updated_by?: string | null;

  created_at: string;
  updated_at: string;
}

export interface UserCreateData {
  first_name: string;
  last_name: string;

  username: string;
  email: string;

  phone_number?: string | null;

  password: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;

  username?: string;
  email?: string;

  phone_number?: string | null;

  password?: string;
}

export interface UserFilters {
  search?: string;
  username?: string;
  email?: string;
}