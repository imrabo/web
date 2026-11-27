import {apiClient} from "@/lib/api/client";
import type {Agent,AgentCategory,AgentRegistration,AgentWaitlist} from "@/features/agents/types";
type BackendAgent={id:number|string;workspace_id:number;name:string;slug:string;description:string;system_prompt:string;icon:string;color:string;model:string;temperature:number;max_tokens?:number|null;enabled:boolean;is_default:boolean;created_at:string;updated_at:string};
const map=(a:BackendAgent):Agent=>({id:String(a.id),title:a.name,description:a.description,organizerName:"",organizerId:"",category:"AI agent",date:"",time:"",locationName:"",latitude:0,longitude:0,maxRegistrations:0,registrationsCount:0,waitlistCount:0,status:a.enabled?"Active":"Cancelled",createdAt:new Date(a.created_at),updatedAt:new Date(a.updated_at)});
async function workspaceId(){const saved=localStorage.getItem("imrabo.activeWorkspaceId");if(saved&&/^\d+$/.test(saved))return Number(saved);const rows=await apiClient.get<Array<{id:number|string}>>("/workspaces");if(!rows.length)throw new Error("Create a workspace before creating an agent");localStorage.setItem("imrabo.activeWorkspaceId",String(rows[0].id));return Number(rows[0].id)}
async function currentUserId(){const u=await apiClient.get<{id:number|string}>("/auth-user/me");return Number(u.id)}
export const agentsService={
 async fetchAgents(){const rows=await apiClient.get<BackendAgent[]>("/agents");return rows.map(map)},
 async fetchAgentById(id:string){return map(await apiClient.get<BackendAgent>(`/agents/${id}`))},
 async fetchCategories():Promise<AgentCategory[]>{return []},
 async fetchRegistrations(_id:string):Promise<AgentRegistration[]>{return []},
 async fetchWaitlist(_id:string):Promise<AgentWaitlist[]>{return []},
 async createAgent(data:Omit<Agent,"id"|"createdAt"|"updatedAt"|"registrationsCount"|"waitlistCount"|"status">){const workspace_id=await workspaceId();const created_by=await currentUserId();const slug=data.title.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return map(await apiClient.post<BackendAgent>("/agents",{workspace_id,name:data.title,slug,description:data.description,system_prompt:data.description||`You are ${data.title}`,icon:"",color:"",model:"gpt-4o-mini",temperature:0.3,enabled:true,is_default:false,created_by}))},
 async updateAgent(id:string,data:Partial<Agent>){const patch:Record<string,unknown>={};if(data.title!==undefined)patch.name=data.title;if(data.description!==undefined)patch.description=data.description;return map(await apiClient.patch<BackendAgent>(`/agents/${id}`,patch))},
 deleteAgent(id:string){return apiClient.delete<void>(`/agents/${id}`)},
};
export default agentsService;
