'use client';
import {useState,type ReactNode} from 'react';
import Link from 'next/link';
import {WorkspaceTools} from './workspace-tools';
import {useWorkspaceTheme} from '@/lib/use-workspace-theme';
import {workspaceNavigation} from '@/lib/workspace-navigation';
import {useRouter} from 'next/navigation';
import {Menu,X} from 'lucide-react';
export default function ProjectWorkspace({section,projectId,children,onNavigate}: {section:'Expedientes'|'Continuidad'|'Tareas';projectId:number;children:ReactNode;onNavigate?:()=>boolean}){
 const [mobile,setMobile]=useState(false);
 const {dark}=useWorkspaceTheme();
 const router=useRouter();
 function go(href:string){if(onNavigate&&!onNavigate())return;setMobile(false);router.push(href+(projectId>0?(href.includes('?')?'&':'?')+'projectId='+projectId:''));}
 return <div className={`shell ${dark?'dark':''}`}>
 {mobile&&<button className="mobile-backdrop" aria-label="Cerrar menú" onClick={()=>setMobile(false)}/>}
 <aside className={`sidebar ${mobile?'mobile-open':''}`}>
 <div className="brand"><span className="brand-icon">G</span><span><strong>GEOCONTROL</strong><small>PROJECT HUB</small></span><button className="sidebar-close" aria-label="Cerrar menú" onClick={()=>setMobile(false)}><X size={20}/></button></div>
 <div className="side-label">WORKSPACE</div>
 <nav>{workspaceNavigation.map(({name,href,icon:Icon})=><button key={name} className={name===section?'active':''} aria-current={name===section?'page':undefined} onClick={()=>go(href)}><span className="nav-icon"><Icon size={18} strokeWidth={1.9}/></span>{name}</button>)}</nav>
 <div className="side-bottom"><Link className="sidebar-guide-link" href="/apariencia">⚙ Apariencia y temas</Link><Link className="sidebar-guide-link" href="/guia-proyecto">📄 Memoria del proyecto · Ver y editar</Link><span className="status-dot"/> Entorno de planificación <small>Geocontrol · v0.1</small></div>
 </aside>
 <main className="main"><header className="topbar"><div className="crumb"><button className="mobile-toggle" aria-label="Abrir menú" aria-expanded={mobile} onClick={()=>setMobile(!mobile)}><Menu size={23}/></button>Workspace <span>/</span><b>{section}</b></div><div className="top-actions"><WorkspaceTools projectId={projectId}/></div></header><div className="content workspace-subpage">{children}</div></main>
 </div>;
}
