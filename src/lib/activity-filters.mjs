export function parseActivityFilters(params){
 const pageRaw=params.get('page')??'1';
 if(!/^[1-9]\d*$/.test(pageRaw)||Number(pageRaw)>10000)return null;
 const action=params.get('action')??'all';
 if(!['all','create','update','delete','archive','restore'].includes(action))return null;
 const from=params.get('from')??'',to=params.get('to')??'';
 const validDate=v=>!v||(/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v);
 if(!validDate(from)||!validDate(to)||(from&&to&&from>to))return null;
 const clauses=[],values=[];
 if(action!=='all'){clauses.push('a.action=?');values.push(action);}
 if(from){clauses.push('a.created_at>=?');values.push(from+' 00:00:00');}
 if(to){clauses.push('a.created_at<?');const d=new Date(to+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+1);values.push(d.toISOString().slice(0,10)+' 00:00:00');}
 return {page:Number(pageRaw),where:clauses.length?' WHERE '+clauses.join(' AND '):'',values};
}
