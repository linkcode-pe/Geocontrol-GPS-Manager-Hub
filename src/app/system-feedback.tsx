'use client';
import type {ReactNode} from 'react';

type FeedbackKind='error'|'success'|'loading';
const feedbackMeta:Record<FeedbackKind,{role:'alert'|'status';className:string;label:string}>={
 error:{role:'alert',className:'project-guide-error',label:'Error'},
 success:{role:'status',className:'project-guide-success',label:'Confirmación'},
 loading:{role:'status',className:'project-guide-loading',label:'En proceso'},
};
/** Consistent, accessible inline feedback; no automatic dismissal of errors. */
export default function SystemFeedback({kind,children}:{kind:FeedbackKind;children:ReactNode}){
 if(!children)return null;
 const meta=feedbackMeta[kind];
 return <p role={meta.role} className={`system-feedback ${meta.className}`}><span className="system-feedback-label">{meta.label}: </span>{children}</p>;
}
