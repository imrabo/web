import {createContext,useEffect,useMemo,type ReactNode} from "react";
import type {UserType} from "@/features/users";
import {authService} from "@/features/auth/services/authService";
import {useAuthStore} from "@/lib/store/authStore";
export interface AuthContextType{user:UserType|null;isAuthenticated:boolean;isLoading:boolean;login:(email:string,password:string)=>Promise<UserType>;logout:()=>Promise<void>;refreshUser:()=>Promise<void>}
export const AuthContext=createContext<AuthContextType|undefined>(undefined);
export function AuthProvider({children}:{children:ReactNode}){
 const {user,isLoading,setUser,setLoading}=useAuthStore();
 useEffect(()=>{let mounted=true;(async()=>{setLoading(true);try{const current=await authService.initialize();if(mounted)setUser(current)}catch{if(mounted)setUser(null)}finally{if(mounted)setLoading(false)}})();return()=>{mounted=false}},[setLoading,setUser]);
 const login=async(email:string,password:string)=>{setLoading(true);try{const result=await authService.login({email,password});setUser(result.user);return result.user}catch(error){setUser(null);throw error}finally{setLoading(false)}};
 const logout=async()=>{setLoading(true);try{await authService.logout();setUser(null)}finally{setLoading(false)}};
 const refreshUser=async()=>{try{setUser(await authService.getCurrentUser())}catch{setUser(null)}};
 const value=useMemo(()=>({user,isAuthenticated:Boolean(user),isLoading,login,logout,refreshUser}),[user,isLoading]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export default AuthProvider;
