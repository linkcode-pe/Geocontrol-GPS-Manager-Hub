'use client';
import {useEffect,useState} from 'react';

export const APPEARANCE_STORAGE_KEY='geocontrol-hub-appearance';
const APPEARANCE_EVENT='geocontrol-hub-appearance-change';
export type Appearance='classic'|'violet';

function readAppearance():Appearance{
 try{return window.localStorage.getItem(APPEARANCE_STORAGE_KEY)==='violet'?'violet':'classic'}catch{return 'classic'}
}
function applyAppearance(value:Appearance){document.documentElement.classList.toggle('theme-violet',value==='violet')}

export function useAppearance(){
 const [appearance,setAppearanceState]=useState<Appearance>('classic');
 useEffect(()=>{
  function sync(){const value=readAppearance();setAppearanceState(value);applyAppearance(value)}
  function onStorage(event:StorageEvent){if(event.key===APPEARANCE_STORAGE_KEY||event.key===null)sync()}
  sync();
  window.addEventListener('storage',onStorage);
  window.addEventListener(APPEARANCE_EVENT,sync);
  return()=>{window.removeEventListener('storage',onStorage);window.removeEventListener(APPEARANCE_EVENT,sync)};
 },[]);
 function setAppearance(value:Appearance){
  setAppearanceState(value);applyAppearance(value);
  try{window.localStorage.setItem(APPEARANCE_STORAGE_KEY,value);window.dispatchEvent(new Event(APPEARANCE_EVENT))}catch{/* The choice remains active for this page when storage is unavailable. */}
 }
 return {appearance,setAppearance};
}
