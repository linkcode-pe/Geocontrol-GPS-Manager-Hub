'use client';
import {useEffect,useState} from 'react';
import SystemFeedback from './system-feedback';
type Summary={id:number;title:string;status:string;phases:number;phasesCompleted:number;tasks:number;tasksCompleted:number;tasksInProgress:number;tasksBlocked:number;documents:number;technicalSheets:number;memories:number;continuity:number;continuityDone:number;activities:number};
export default function PortfolioOverview({section,onSelect}:{section:string;onSelect:(id:number)=>void}){
 const [rows,setRows]=useState<Summary[]>([]),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{let live=true;fetch('/api/portfolio-summary').then(async r=>{if(!r.ok)throw Error('No se pudo cargar el resumen');return r.json();}).then(d=>{if(live)setRows(d.projects||[]);}).catch(e=>{if(live)setError(e.message);}).finally(()=>{if(live)setLoading(false);});return()=>{live=false;};},[section]);
 const sum=(key:keyof Summary)=>rows.reduce((n,p)=>n+Number(p[key]||0),0);
 const phases=sum('phases'),tasks=sum('tasks'),done=sum('tasksCompleted');
 const metric=section==='Fases'?'phases':section==='Tareas'?'tasks':section==='Documentación'?'documents':section==='Actividad'?'activities':section==='Continuidad'?'continuity':'tasks';
 const compareByProject=['Expedientes'].includes(section);const value=(p:Summary)=>compareByProject?1:Number(p[metric]);
 const unit=section==='Fases'?'fase':section==='Documentación'?'documento':section==='Actividad'?'evento':'tarea';
 const maxValue=rows.reduce((maximum,p)=>Math.max(maximum,value(p)),0);
 return <section className="panel portfolio-overview" aria-label={`Resumen general de ${section}`}>
  <div className="panel-head"><div><h2>{section==='Dashboard'?'Portafolio general':`Panel general de ${section.toLowerCase()}`}</h2><p>Todos los proyectos · selecciona uno para ver y administrar sus detalles.</p></div></div>
  {loading?<SystemFeedback kind="loading">Cargando indicadores…</SystemFeedback>:error?<p role="alert">{error}</p>:<>
   <div className="portfolio-kpis">
    <div><span>Proyectos</span><strong>{rows.length}</strong></div>
    <div><span>Fases</span><strong>{phases}</strong></div>
    <div><span>Tareas</span><strong>{tasks}</strong></div>
    <div><span>Completadas</span><strong>{done}</strong></div>
    <div><span>Documentos</span><strong>{sum('documents')}</strong></div>
   </div>
   <div className="portfolio-kpis portfolio-section-kpis" aria-label="Indicadores de la sección">
    {section==='Fases'&&<><div><span>Fases completadas</span><strong>{sum('phasesCompleted')}</strong></div><div><span>Fases pendientes o activas</span><strong>{phases-sum('phasesCompleted')}</strong></div></>}
    {section==='Tareas'&&<><div><span>En curso</span><strong>{sum('tasksInProgress')}</strong></div><div><span>Bloqueadas</span><strong>{sum('tasksBlocked')}</strong></div><div><span>Pendientes</span><strong>{tasks-done-sum('tasksInProgress')-sum('tasksBlocked')}</strong></div></>}
    {section==='Actividad'&&<div><span>Eventos asociados a proyectos</span><strong>{sum('activities')}</strong></div>}
    {section==='Continuidad'&&<><div><span>Registros</span><strong>{sum('continuity')}</strong></div><div><span>Finalizados</span><strong>{sum('continuityDone')}</strong></div></>}
    {section==='Documentación'&&<div><span>Documentos activos</span><strong>{sum('documents')}</strong></div>}
    {section==='Expedientes'&&<><div><span>Fichas técnicas</span><strong>{sum('technicalSheets')}</strong></div><div><span>Memorias de proyecto</span><strong>{sum('memories')}</strong></div><div><span>Registros de continuidad</span><strong>{sum('continuity')}</strong></div></>}
   </div>
   <h3>{compareByProject?"Proyectos disponibles":"Distribución por proyecto"}</h3>
   <div className="portfolio-bars" role="list">{rows.map(p=><button type="button" role="listitem" key={p.id} onClick={()=>onSelect(p.id)} aria-label={`Abrir ${section} de ${p.title}`}><span className="portfolio-bar-head"><strong>{p.title}</strong><span>{compareByProject?`${p.technicalSheets} fichas · ${p.memories} memorias · ${p.continuity} continuidad`:`${value(p)} ${unit}${value(p)===1?"":"s"}`}</span></span><span className="portfolio-bar-track"><span style={{width:`${maxValue?value(p)/maxValue*100:0}%`}}/></span><small>{p.phases} fases · {p.tasks} tareas · {p.tasksCompleted} completadas · {p.documents} documentos</small></button>)}</div>
   {!rows.length&&<p>Aún no hay proyectos. Crea uno desde la sección Proyectos.</p>}
   <p className="portfolio-help">{compareByProject?"Selecciona un proyecto para consultar su información. Los expedientes se organizan por proyecto.":"Las gráficas comparan cantidades por proyecto. Selecciona una barra para abrir sus datos."}</p>
  </>}
 </section>;
}
