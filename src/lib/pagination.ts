export function taskPagination(rawPage: string | null, rawLimit: string | null) {
 const page=rawPage===null?1:Number(rawPage);
 const limit=rawLimit===null?100:Number(rawLimit);
 if(!Number.isSafeInteger(page)||page<1||!Number.isSafeInteger(limit)||limit<1||limit>200) return null;
 const offset=(page-1)*limit;
 if(!Number.isSafeInteger(offset)||offset>10000000)return null;
 return {page,limit,offset};
}
