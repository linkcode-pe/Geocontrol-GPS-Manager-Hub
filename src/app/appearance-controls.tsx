'use client';
import {useAppearance,type Appearance} from '@/lib/use-appearance';

export function AppearanceProvider(){useAppearance();return null}
export function AppearanceSelect(){
 const {appearance,setAppearance}=useAppearance();
 return <select className="appearance-select" aria-label="Diseño de la página" title="Diseño de la página" value={appearance} onChange={event=>setAppearance(event.target.value as Appearance)}><option value="classic">Actual</option><option value="violet">Violeta</option></select>;
}
