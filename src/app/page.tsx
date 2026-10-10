"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, Workflow, ListTodo, FileText, Activity, Menu, Moon, Sun, UserRound, Building2, Layers3, ListChecks, TrendingUp, Plus, X, LogOut, KeyRound } from "lucide-react";

type Task = { id: number; title: string; phase: number; done: boolean };
const phases = [
  { title: "Análisis y requisitos", detail: "Alcance, necesidades y auditoría segura de Traccar" },
  { title: "Arquitectura", detail: "Modelo de datos, permisos y contratos de integración" },
  { title: "Desarrollo", detail: "Administración, usuarios y dispositivos GPS" },
  { title: "Integración Traccar", detail: "API, pruebas y operaciones autorizadas" },
  { title: "Pruebas y producción", detail: "Seguridad, validación y despliegue controlado" },
];
const initialTasks: Task[] = [];
const docs = [
  { name: "Visión del producto", type: "Producto", text: "Geocontrol GPS Manager será una plataforma administrativa independiente de Traccar. Tendrá cuentas, roles y base de datos propios. Traccar continuará gestionando el rastreo GPS." },
  { name: "Principios de arquitectura", type: "Arquitectura", text: "No modificar el código fuente de Traccar. No escribir directamente en su base de datos. Integrar mediante API y mantener credenciales técnicas solo en el backend." },
  { name: "Flujo de trabajo", type: "Operaciones", text: "ChatGPT → Codex → GitHub → Desktop Commander remoto → Producción. Todo cambio debe revisarse y probarse antes del despliegue." },
  { name: "Fases del proyecto", type: "Planificación", text: phases.map((p,i)=>`${i+1}. ${p.title}: ${p.detail}`).join("\n") },
];
const icons = { Dashboard:LayoutDashboard, Proyectos:FolderKanban, Fases:Workflow, Tareas:ListTodo, Documentación:FileText, Actividad:Activity };
export default function Home() {
  const router=useRouter();
  const [section,setSection]=useState("Dashboard");
  const [tasks,setTasks]=useState<Task[]>(initialTasks);
  const [taskError,setTaskError]=useState("");
  const [draft,setDraft]=useState("");
  const [selectedDoc,setSelectedDoc]=useState(0);
  const [dark,setDark]=useState(false);
  const [mobile,setMobile]=useState(false);
  useEffect(()=>{ fetch("/api/tasks").then(async r=>{if(!r.ok)throw new Error("No se pudieron cargar las tareas");return r.json();}).then(data=>setTasks(data.tasks.map((t:{id:number;title:string;status:string;phase_id:number|null})=>({id:t.id,title:t.title,phase:t.phase_id==null?-1:Math.max(0,Number(t.phase_id)-1),done:t.status==="done"})))).catch(()=>setTaskError("No se pudieron cargar las tareas de MySQL")); },[]);
  const complete=tasks.filter(t=>t.done).length;
  const progress=tasks.length ? Math.round(complete/tasks.length*100):0;
  async function addTask(){if(!draft.trim())return;setTaskError("");try{const response=await fetch("/api/tasks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:draft.trim()})});if(!response.ok)throw new Error();const result=await fetch("/api/tasks");if(!result.ok)throw new Error();const data=await result.json();setTasks(data.tasks.map((t:{id:number;title:string;status:string;phase_id:number|null})=>({id:t.id,title:t.title,phase:t.phase_id==null?-1:Math.max(0,Number(t.phase_id)-1),done:t.status==="done"})));setDraft("");}catch{setTaskError("No se pudo guardar la tarea");}}
  async function toggleTask(task:Task){setTaskError("");try{const response=await fetch(`/api/tasks/${task.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({done:!task.done})});if(!response.ok)throw new Error();setTasks(p=>p.map(x=>x.id===task.id?{...x,done:!x.done}:x));}catch{setTaskError("No se pudo actualizar la tarea");}}
  const navigation=["Dashboard","Proyectos","Fases","Tareas","Documentación","Actividad"];
  return <div className={`shell ${dark?"dark":""}`}>
    {mobile&&<button className="mobile-backdrop" aria-label="Cerrar menú" onClick={()=>setMobile(false)}/>}
    <aside className={`sidebar ${mobile?"mobile-open":""}`}> 
      <div className="brand"><span className="brand-icon">G</span><span><strong>GEOCONTROL</strong><small>PROJECT HUB</small></span><button className="sidebar-close" aria-label="Cerrar menú" onClick={()=>setMobile(false)}><X size={20}/></button></div>
      <div className="side-label">WORKSPACE</div>
      <nav>{navigation.map(item=><button key={item} onClick={()=>{setSection(item);setMobile(false)}} className={section===item?"active":""}><span className="nav-icon">{(() => { const Icon=icons[item as keyof typeof icons];return <Icon size={18} strokeWidth={1.9}/>; })()}</span>{item}{item==="Tareas"&&<em>{tasks.filter(t=>!t.done).length}</em>}</button>)}</nav>
      <div className="side-bottom"><span className="status-dot"/> Entorno de planificación <small>Geocontrol · v0.1</small></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb"><button className="mobile-toggle" onClick={()=>setMobile(!mobile)}><Menu size={23}/></button>Workspace <span>/</span> <b>{section}</b></div><div className="top-actions"><span className="top-status"><i/> Proyecto activo</span><button className="theme-button" onClick={()=>setDark(!dark)} aria-label="Cambiar tema">{dark?<Sun size={19}/>:<Moon size={19}/>}</button><button className="theme-button" onClick={()=>{router.push("/change-password")}} aria-label="Cambiar contraseña"><UserRound size={17}/><span>Cuenta</span></button><span className="avatar">GC</span></div></header>
      <div className="content">
        <div className="heading"><div><div className="eyebrow">GEOCONTROL / PROJECT MANAGEMENT</div><h1>{section==="Dashboard"?"Centro de control":section}</h1><p>{section==="Dashboard"?"Una visión clara de cada decisión, fase y avance del proyecto.":"Gestión y seguimiento de Geocontrol GPS Manager."}</p></div><span className="date-label">● EN PLANIFICACIÓN</span></div>
        {section==="Dashboard"&&<><div className="metrics">
          <article className="metric"><div className="metric-top">Proyectos <span><Building2 size={23}/></span></div><strong>01</strong><small>Geocontrol GPS Manager</small></article>
          <article className="metric"><div className="metric-top">Fases definidas <span><Layers3 size={23}/></span></div><strong>05</strong><small>Hoja de ruta inicial</small></article>
          <article className="metric"><div className="metric-top">Tareas pendientes <span><ListChecks size={23}/></span></div><strong>{tasks.length-complete}</strong><small>{complete} tareas completadas</small></article>
          <article className="metric"><div className="metric-top">Avance de tareas <span><TrendingUp size={23}/></span></div><strong>{progress}%</strong><div className="progress"><span style={{width:`${progress}%`}}/></div></article>
        </div>
        <div className="columns"><section className="panel"><div className="panel-head"><div><h2>Proyecto principal</h2><p>Planificación y ejecución</p></div><span className="pill blue">En planificación</span></div><div className="project-line"><div className="project-logo">G</div><div><h3>Geocontrol GPS Manager</h3><p>Plataforma administrativa independiente para Traccar GPS</p></div></div><div className="section-progress"><span>Progreso de tareas</span><b>{progress}%</b></div><div className="progress"><span style={{width:`${progress}%`}}/></div><button className="text-link" onClick={()=>setSection("Proyectos")}>Ver detalles del proyecto →</button></section>
        <section className="panel"><div className="panel-head"><div><h2>Próximas tareas</h2><p>Actividades prioritarias</p></div><button className="text-link" onClick={()=>setSection("Tareas")}>Ver todas →</button></div><div className="task-list">{tasks.filter(t=>!t.done).slice(0,4).map(t=><label className="task-row" key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggleTask(t)}/><span>{t.title}</span></label>)}{tasks.length===0?<p>Aún no hay tareas registradas.</p>:tasks.every(t=>t.done)&&<p>¡Todas las tareas están completadas!</p>}</div></section></div>
        <section className="panel phases-panel"><div className="panel-head"><div><h2>Hoja de ruta</h2><p>Cinco fases para una ejecución controlada</p></div><button className="text-link" onClick={()=>setSection("Fases")}>Explorar fases →</button></div><div className="roadmap">{phases.map((p,i)=><div className="road-step" key={i}><span className={i===0?"step-num current":"step-num"}>{String(i+1).padStart(2,"0")}</span><b>{p.title}</b><small>{i===0?"Planificada":"Pendiente"}</small></div>)}</div></section></>}
        {section==="Proyectos"&&<section className="panel detail-panel"><span className="pill blue">Proyecto principal</span><h2>Geocontrol GPS Manager</h2><p>Una plataforma de administración integral e independiente para el ecosistema Traccar GPS, con autenticación y roles propios.</p><div className="info-grid"><div><small>INTEGRACIÓN</small><strong>API REST Traccar</strong></div><div><small>DATOS ADMINISTRATIVOS</small><strong>Base de datos independiente</strong></div><div><small>ETAPA ACTUAL</small><strong>Análisis y planificación</strong></div></div><h3>Principios del proyecto</h3><p>Sin modificaciones al código fuente de Traccar, sin escrituras directas en su base de datos y sin intervenciones destructivas sobre producción.</p></section>}
        {section==="Fases"&&<div className="phase-list">{phases.map((p,i)=><section className="panel phase-card" key={i}><span className="step-num">{String(i+1).padStart(2,"0")}</span><div><h2>{p.title}</h2><p>{p.detail}</p><small>{tasks.filter(t=>t.phase===i&&t.done).length} de {tasks.filter(t=>t.phase===i).length} tareas completadas</small></div><span className="pill">{i===0?"Planificada":"Pendiente"}</span></section>)}</div>}
        {section==="Tareas"&&<section className="panel detail-panel"><div className="panel-head"><div><h2>Lista de tareas</h2><p>Las tareas se almacenan en MySQL.</p>{taskError&&<p role="alert">{taskError}</p>}</div><span className="pill blue">{complete}/{tasks.length} completadas</span></div><div className="add-task"><input placeholder="Escribe una nueva tarea..." value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()}/><button onClick={addTask}><Plus size={16}/> Añadir</button></div><div className="task-list">{tasks.map(t=><label className="task-row" key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggleTask(t)}/><span className={t.done?"done":""}>{t.title}</span><small>{t.phase<0?"Sin fase":`Fase ${t.phase+1}`}</small></label>)}</div></section>}
        {section==="Documentación"&&<div className="docs-layout"><section className="panel doc-menu"><h2>Documentos base</h2>{docs.map((d,i)=><button className={selectedDoc===i?"selected":""} onClick={()=>setSelectedDoc(i)} key={d.name}><span><FileText size={18}/></span><div><b>{d.name}</b><small>{d.type}</small></div></button>)}</section><section className="panel doc-content"><span className="pill blue">{docs[selectedDoc].type}</span><h2>{docs[selectedDoc].name}</h2><p>{docs[selectedDoc].text}</p><div className="notice">Versión inicial de referencia. La edición colaborativa y el historial persistente se incorporarán con MySQL y autenticación.</div></section></div>}
        {section==="Actividad"&&<section className="panel detail-panel"><h2>Registro inicial</h2><div className="activity-item"><span className="status-dot"/><div><b>Creación del centro de control</b><p>Primera versión del dashboard y documentación de Geocontrol GPS Manager.</p></div></div><div className="notice">La auditoría de cambios persistente estará disponible en la siguiente fase.</div></section>}
        <footer>© 2026 Geocontrol Project Hub <span>Construido para una gestión transparente y ordenada.</span></footer>
      </div>
    </main>
  </div>;
}
