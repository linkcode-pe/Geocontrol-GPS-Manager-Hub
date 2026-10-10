const publicOrigin = "https://hub.geocontrol.online";
export function isAllowedOrigin(req: Request): boolean {
 const origin=req.headers.get("origin");
 if(!origin)return false;
 const expected=process.env.NODE_ENV==="production"?publicOrigin:new URL(req.url).origin;
 return origin===expected;
}
