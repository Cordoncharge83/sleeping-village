/** Paths in the asset catalogue and journal are relative to public/, not the website root. */
export function publicAssetUrl(path:string):string {
 return import.meta.env.BASE_URL+path.replace(/^\/+/, '');
}
