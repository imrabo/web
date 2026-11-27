import {apiClient} from "@/lib/api/client";
export interface Device{device_id:string;name:string;platform:string;app_version?:string;last_seen_at:string;created_at:string}
export const deviceService={
 list:()=>apiClient.get<Device[]>("/devices"),
 get:(id:string)=>apiClient.get<Device>(`/devices/${encodeURIComponent(id)}`),
 register:(data:{device_id:string;name:string;platform:string;app_version?:string;push_token?:string;metadata?:Record<string,unknown>})=>apiClient.post<Device>("/devices",data),
 update:(id:string,data:Partial<Pick<Device,"name"|"app_version">>)=>apiClient.patch<Device>(`/devices/${encodeURIComponent(id)}`,data),
 revoke:(id:string)=>apiClient.delete<void>(`/devices/${encodeURIComponent(id)}`),
};
