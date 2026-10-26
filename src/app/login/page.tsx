"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login(){
 const router=useRouter();
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");try{const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});if(!r.ok){setError("Credenciales inválidas");return;}router.replace("/");router.refresh();}catch{setError("No se pudo conectar");}finally{setBusy(false);}}
 return <main className="hub-login"><form onSubmit={submit} className="hub-login-card"><div className="hub-login-brand">GEOCONTROL · PROJECT HUB</div><h1>Acceso privado</h1><p>Inicia sesión para administrar tus proyectos.</p><label>Correo electrónico<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Contraseña<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert" className="hub-login-error">{error}</p>}<button disabled={busy}>{busy?"Verificando...":"Ingresar"}</button></form></main>;
}
