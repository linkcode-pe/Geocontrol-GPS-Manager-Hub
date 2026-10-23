/** Maximum project memory length; MySQL MEDIUMTEXT has a 16 MiB byte limit. */
export const PROJECT_GUIDE_MAX_CHARACTERS=500_000;
export const PROJECT_GUIDE_MAX_BYTES=1_000_000;

/** Reject oversized text before attempting a database transaction. */
export function validProjectGuideContent(content:unknown):content is string{
 return typeof content==='string'&&content.trim().length>=20&&content.length<=PROJECT_GUIDE_MAX_CHARACTERS&&Buffer.byteLength(content,'utf8')<=PROJECT_GUIDE_MAX_BYTES;
}
