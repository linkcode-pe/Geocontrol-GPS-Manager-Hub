import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export default async function ProjectGuide(){
 const content=await readFile(path.join(process.cwd(),'docs','PROJECT_CONTEXT.md'),'utf8');
 return <main className="project-guide"><div className="project-guide-top"><div><span className="project-guide-kicker">GEOCONTROL PROJECT HUB</span><h1>Memoria permanente del proyecto</h1><p>Objetivos, funcionamiento, avances y pendientes para retomar el trabajo en cualquier chat.</p></div><Link href="/">Volver al panel</Link></div><article className="project-guide-paper"><pre>{content}</pre></article><p className="project-guide-foot">Documento versionado en GitHub. Se actualiza con cada hito relevante.</p></main>;
}
