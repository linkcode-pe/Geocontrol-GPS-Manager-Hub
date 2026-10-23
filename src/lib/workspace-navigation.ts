import {LayoutDashboard,FolderKanban,Workflow,ListTodo,FileText,Activity,ListChecks} from 'lucide-react';

/** Single source of truth for workspace navigation order and destinations. */
export const workspaceNavigation=[
 {name:'Dashboard',href:'/',icon:LayoutDashboard},
 {name:'Proyectos',href:'/?section=Proyectos',icon:FolderKanban},
 {name:'Fases',href:'/?section=Fases',icon:Workflow},
 {name:'Tareas',href:'/?section=Tareas',icon:ListTodo},
 {name:'Documentación',href:'/?section=Documentación',icon:FileText},
 {name:'Actividad',href:'/?section=Actividad',icon:Activity},
 {name:'Expedientes',href:'/expedientes',icon:FolderKanban},
 {name:'Continuidad',href:'/continuidad',icon:ListChecks},
] as const;
