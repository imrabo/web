import {apiClient} from "@/lib/api/client";
export interface Team{ id:string;name:string;slug:string;description?:string;owner_id:number;member_count:number;max_members:number;created_at:string }
export interface TeamMember{team_id:string;user_id:number;email:string;role:"owner"|"admin"|"member";status:string;joined_at:string}
export const teamService={
 list:()=>apiClient.get<Team[]>("/teams"),
 get:(id:string)=>apiClient.get<Team&{members:TeamMember[]}>(`/teams/${id}`),
 create:(data:{name:string;slug:string;description?:string})=>apiClient.post<Team>("/teams",data),
 update:(id:string,data:{name?:string;description?:string})=>apiClient.patch<Team>(`/teams/${id}`,data),
 remove:(id:string)=>apiClient.delete<void>(`/teams/${id}`),
 members:(id:string)=>apiClient.get<TeamMember[]>(`/teams/${id}/members`),
 invite:(id:string,email:string,role:"member"|"admin"="member")=>apiClient.post<{message:string;invitation_token:string;expires_at:string}>(`/teams/${id}/invitations`,{email,role}),
 acceptInvitation:(token:string)=>apiClient.post("/teams/invitations/accept",undefined,{token}),
 removeMember:(id:string,userId:number)=>apiClient.delete<void>(`/teams/${id}/members/${userId}`),
};
