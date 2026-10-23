'use client';
import {useEffect,useState} from 'react';

export const WORKSPACE_THEME_STORAGE_KEY='geocontrol-hub-theme';

/** Keep the theme consistent across the dashboard and project subpages. */
export function useWorkspaceTheme(){
 const [dark,setDark]=useState(false);
 useEffect(()=>{
  try {const saved=window.localStorage.getItem(WORKSPACE_THEME_STORAGE_KEY);queueMicrotask(()=>setDark(saved==='dark'));}catch{/* Storage can be unavailable in private browsing. */}
  const onStorage=(event:StorageEvent)=>{
   if(event.key===WORKSPACE_THEME_STORAGE_KEY||event.key===null){
    queueMicrotask(()=>setDark(event.key===null?false:event.newValue==='dark'));
   }
  };
  window.addEventListener('storage',onStorage);
  return ()=>window.removeEventListener('storage',onStorage);
 },[]);
 function toggleTheme(){
  const next=!dark;
  setDark(next);
  try{window.localStorage.setItem(WORKSPACE_THEME_STORAGE_KEY,next?'dark':'light')}catch{/* Theme still works for this page. */}
 }

 return {dark,toggleTheme};
}
