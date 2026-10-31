'use client';

export type SectionTab<Id extends string>={id:Id;label:string};

/** Reusable horizontal section navigation for current and future Hub pages. */
export default function SectionSubnav<Id extends string>({label,tabs,active,onChange}:{label:string;tabs:readonly SectionTab<Id>[];active:Id;onChange:(tab:Id)=>void}){
 return <nav className="project-subnav" aria-label={label}>{tabs.map(tab=><button key={tab.id} type="button" className={active===tab.id?'active':''} aria-current={active===tab.id?'page':undefined} onClick={()=>onChange(tab.id)}>{tab.label}</button>)}</nav>;
}
