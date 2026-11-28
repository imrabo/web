export interface ApiResponse<T=unknown>{success:boolean;data?:T;error?:{code:string;message:string;details?:Record<string,unknown>}}
export type QueryParams=Record<string,string|number|boolean|Date|null|undefined>;
let accessToken:string|null=null;let refreshing:Promise<string|null>|null=null;
export function setAccessToken(token:string|null){accessToken=token}
export function getAccessToken(){return accessToken}
export class ApiError extends Error{constructor(message:string,public statusCode=500,public code="API_ERROR",public details?:Record<string,unknown>){super(message);this.name="ApiError"}}
export class ApiClient{
 private baseUrl:string;private timeout=30000;
 constructor(baseUrl:string=import.meta.env.VITE_PUBLIC_API_URL||import.meta.env.VITE_API_BASE_URL||""){this.baseUrl=baseUrl.replace(/\/$/,"").replace(/\/api\/v1$/,"")}
 private url(endpoint:string,params?:QueryParams){const path=endpoint.startsWith("/api/v1/")?endpoint:`/api/v1${endpoint.startsWith("/")?endpoint:`/${endpoint}`}`;const url=new URL(`${this.baseUrl}${path}`,window.location.origin);Object.entries(params??{}).forEach(([k,v])=>{if(v!==undefined&&v!==null&&v!=="")url.searchParams.set(k,v instanceof Date?v.toISOString():String(v))});return url.toString()}
 private async refresh():Promise<string|null>{if(refreshing)return refreshing;refreshing=(async()=>{try{const r=await fetch(this.url("/auth-user/refresh"),{method:"POST",credentials:"include"});if(!r.ok){accessToken=null;return null}const d=await r.json() as {access_token?:string};accessToken=d.access_token??null;return accessToken}catch{accessToken=null;return null}finally{refreshing=null}})();return refreshing}
 async refreshSession(){return this.refresh()}
 private async request<T>(endpoint:string,method:"GET"|"POST"|"PATCH"|"PUT"|"DELETE"="GET",data?:unknown,params?:QueryParams):Promise<T>{
  const url=this.url(endpoint,params);const run=()=>{const headers:Record<string,string>={"Content-Type":"application/json"};if(accessToken)headers.Authorization=`Bearer ${accessToken}`;const init:RequestInit={method,credentials:"include",headers,signal:AbortSignal.timeout(this.timeout)};if(data!==undefined&&method!=="GET")init.body=JSON.stringify(data);return fetch(url,init)};
  let response=await run();const authCall=endpoint.includes("/auth-user/login")||endpoint.includes("/auth-user/register")||endpoint.includes("/auth-user/refresh");
  if(response.status===401&&!authCall){const token=await this.refresh();if(token)response=await run()}
  if(response.status===204)return undefined as T;
  const ct=response.headers.get("content-type");const body=ct?.includes("application/json")?await response.json() as ApiResponse<T>|T:undefined;
  if(!response.ok){const obj=body&&typeof body==="object"?body as Record<string,unknown>:{};const nested=obj.error&&typeof obj.error==="object"?obj.error as Record<string,unknown>:{};const msg=typeof nested.message==="string"?nested.message:typeof obj.detail==="string"?obj.detail:typeof obj.message==="string"?obj.message:response.statusText||`HTTP ${response.status}`;throw new ApiError(msg,response.status,typeof nested.code==="string"?nested.code:"HTTP_ERROR",nested.details as Record<string,unknown>|undefined)}
  if(body&&typeof body==="object"&&"success" in body){const envelope=body as ApiResponse<T>;if(!envelope.success)throw new ApiError(envelope.error?.message||"Request failed",response.status,envelope.error?.code||"API_ERROR",envelope.error?.details);return envelope.data as T}
  return body as T
 }
 get<T>(endpoint:string,params?:QueryParams){return this.request<T>(endpoint,"GET",undefined,params)}
 post<T>(endpoint:string,data?:unknown,params?:QueryParams){return this.request<T>(endpoint,"POST",data,params)}
 patch<T>(endpoint:string,data?:unknown,params?:QueryParams){return this.request<T>(endpoint,"PATCH",data,params)}
 put<T>(endpoint:string,data?:unknown,params?:QueryParams){return this.request<T>(endpoint,"PUT",data,params)}
 delete<T>(endpoint:string,params?:QueryParams){return this.request<T>(endpoint,"DELETE",undefined,params)}
 getWithQuery<T>(endpoint:string,params?:QueryParams){return this.get<T>(endpoint,params)}
}
export const apiClient=new ApiClient();
