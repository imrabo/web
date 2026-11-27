import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {authService} from "../services/authService";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card";
export default function ForgotPasswordPage(){
 const [email,setEmail]=useState("");const [token,setToken]=useState("");const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");const [sent,setSent]=useState(false);const [busy,setBusy]=useState(false);const navigate=useNavigate();
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);try{if(!sent){await authService.forgotPassword({email});setSent(true);toast.success("If the account exists, reset instructions were sent")}else{if(password!==confirm){toast.error("Passwords do not match");return}await authService.resetPassword({email,token,newPassword:password,confirmPassword:confirm});toast.success("Password reset. Sign in with your new password.");navigate("/login",{replace:true})}}catch(err){toast.error(err instanceof Error?err.message:"Unable to reset password")}finally{setBusy(false)}}
 return <div className="flex min-h-screen items-center justify-center px-4"><Card className="w-full max-w-md"><CardHeader><CardTitle>{sent?"Reset password":"Forgot password"}</CardTitle><CardDescription>{sent?"Enter the one-time reset token from your email and choose a new password.":"We will send password reset instructions if this account exists."}</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="flex flex-col gap-4"><Label htmlFor="email">Email address</Label><Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} disabled={sent} required/>{sent&&<><Label htmlFor="token">Reset token</Label><Input id="token" value={token} onChange={e=>setToken(e.target.value)} required/><Label htmlFor="password">New password</Label><Input id="password" type="password" minLength={10} value={password} onChange={e=>setPassword(e.target.value)} required/><Label htmlFor="confirm">Confirm new password</Label><Input id="confirm" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/></>}<Button disabled={busy}>{busy?"Please wait…":sent?"Reset password":"Send reset instructions"}</Button><Link to="/login" className="text-center text-sm text-muted-foreground underline">Back to sign in</Link></form></CardContent></Card></div>
}
