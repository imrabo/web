import {apiClient} from "@/lib/api/client";
import type {Connector,ConnectorStats,CreateConnectorInput,UpdateConnectorInput} from "../types/connector.types";
type BackendConnector={id:number|string;name:string;slug:string;description?:string|null;type:"http"|"mcp"|"webhook";owner_id?:number|null;visibility:string;status:string;enabled:boolean;icon_url?:string|null;version:string;config:Record<string,unknown>;workspace_id?:number|null;created_at:string;updated_at:string};
const map=(c:BackendConnector):Connector=>({id:String(c.id),title:c.name,description:c.description??"",thumbnail:c.icon_url??"",url:String(c.config?.url??""),category:c.type,fileType:c.type,creatorId:String(c.owner_id??""),downloads:0,isPremium:c.visibility!=="public",createdAt:c.created_at,updatedAt:c.updated_at});
export const resourcesService={
 async fetchConnectors(filters?:Record<string,string|number|boolean|Date>){const list=await apiClient.get<BackendConnector[]>("/connectors",filters);return list.map(map)},
 async fetchConnectorById(id:string){return map(await apiClient.get<BackendConnector>(`/connectors/${id}`))},
 async fetchConnectorsByCreator(creatorId:string){return (await apiClient.get<BackendConnector[]>(`/connectors/owner/${creatorId}`)).map(map)},
 async createConnector(data:CreateConnectorInput){const d=data as unknown as Record<string,unknown>;return map(await apiClient.post<BackendConnector>("/connectors",{name:d.title??d.name,slug:String(d.slug??d.title??d.name).toLowerCase().replace(/[^a-z0-9]+/g,"-"),description:d.description,type:d.type??"mcp",owner_type:"user",visibility:d.isPremium?"private":"public",status:"active",enabled:true,icon_url:d.thumbnail,config:{url:d.url},auth_type:"none"}))},
 async updateConnector(id:string,data:UpdateConnectorInput){const d=data as unknown as Record<string,unknown>;const patch:Record<string,unknown>={};if(d.title!==undefined)patch.name=d.title;if(d.description!==undefined)patch.description=d.description;if(d.thumbnail!==undefined)patch.icon_url=d.thumbnail;if(d.url!==undefined)patch.config={url:d.url};return map(await apiClient.put<BackendConnector>(`/connectors/${id}`,patch))},
 deleteConnector(id:string){return apiClient.delete<void>(`/connectors/${id}`)},
 async getConnectorStats():Promise<ConnectorStats>{const rows=await this.fetchConnectors();return {totalConnectors:rows.length,totalDownloads:0,mostPopularCategory:"",mostDownloadedConnector:null,premiumConnectors:rows.filter(x=>x.isPremium).length,freeConnectors:rows.filter(x=>!x.isPremium).length}},
 async getPopularConnectors(limit=10){return (await this.fetchConnectors()).slice(0,limit)},
 async getRecentConnectors(limit=10){return (await this.fetchConnectors()).slice(0,limit)},
 async fetchFileConnectors(){return []},async fetchProducts(){return []},
 async createProduct(_data: unknown): Promise<StoreProduct>{throw new Error("Products are not part of the backend connector API")},
 async updateProduct(_id: string, _data: Partial<StoreProduct>): Promise<StoreProduct>{throw new Error("Products are not part of the backend connector API")},
 async deleteProduct(_id: string): Promise<void>{throw new Error("Products are not part of the backend connector API")},
 async incrementDownloads(_id: string): Promise<Connector>{throw new Error("Download tracking is not part of the backend connector API")},
};
export default resourcesService;
