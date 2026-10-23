'use client';
import {useEffect,useState} from 'react';

const STORAGE_KEY='geocontrol-hub-theme';

/** Keep the theme consistent across the dashboard and project subpages. */
export function useWorkspaceTheme(){
 const [dark,setDark]=useState(false);
 useEffect(()=>{
  try {const saved=window.localStorage.getItem(STORAGE_KEY);queueMicrotask(()=>setDark(saved==='dark'));}catch{/* Storage can be unavailable in private browsing. */}
 },[]);
 function toggleTheme(){
  const next=!dark;
  setDark(next);
  try{window.localStorage.setItem(STORAGE_KEY,next?'dark':'light')}catch{/* Theme still works for this page. */}
 }

 return {dark,toggleTheme};
}
