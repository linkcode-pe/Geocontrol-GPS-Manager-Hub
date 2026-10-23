'use client';
import {useEffect,useRef,useState} from 'react';

type Props={title:string;busy:boolean;onCancel:()=>void;onConfirm:(confirmedTitle:string)=>void};
/** Native modal provides focus trapping and Escape handling. Exact-title confirmation is mandatory. */
export default function ConfirmPermanentDelete({title,busy,onCancel,onConfirm}:Props){
 const dialog=useRef<HTMLDialogElement>(null);
 const [typed,setTyped]=useState('');
 useEffect(()=>{const element=dialog.current;if(!element)return;element.showModal();return ()=>{if(element.open)element.close()};},[]);
 return <dialog ref={dialog} className="permanent-delete-dialog" aria-labelledby="permanent-delete-heading" aria-describedby="permanent-delete-description" onCancel={e=>{if(busy){e.preventDefault();return;}onCancel()}}>
  <h2 id="permanent-delete-heading">Eliminar registro permanentemente</h2>
  <p id="permanent-delete-description">Se eliminarán «{title}» y todas sus revisiones. Esta acción no se puede deshacer.</p>
  <form onSubmit={e=>{e.preventDefault();if(!busy&&typed===title)onConfirm(typed)}}>
   <label htmlFor="permanent-delete-confirmation">Escribe el título exacto para confirmar: <strong>{title}</strong></label>
   <input id="permanent-delete-confirmation" autoFocus autoComplete="off" value={typed} onChange={e=>setTyped(e.target.value)} disabled={busy}/>
   <div className="project-guide-buttons"><button type="button" onClick={onCancel} disabled={busy}>Cancelar</button><button type="submit" disabled={busy||typed!==title} className="danger-button">{busy?'Eliminando…':'Eliminar permanentemente'}</button></div>
  </form>
 </dialog>;
}
