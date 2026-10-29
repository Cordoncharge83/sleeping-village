import {isEntryId,hasAllDiscoveries,type EntryId} from './journal-data.ts';
export const DISCOVERY_KEY='sleeping-village.journal.v1';
type StorageAccess={getItem:(key:string)=>string|null;setItem:(key:string,value:string)=>void};
export function decodeDiscoveries(raw:string|null):EntryId[]{
 try{const data=JSON.parse(raw??'null');if(data?.version!==1||!Array.isArray(data.entries))return [];
  return [...new Set<EntryId>(data.entries.filter(isEntryId))];
 }catch{return [];}
}
export function loadDiscoveries(storage:StorageAccess):EntryId[]{try{return decodeDiscoveries(storage.getItem(DISCOVERY_KEY));}catch{return [];}}
export function saveDiscoveries(storage:StorageAccess,ids:EntryId[]):boolean{
 try{storage.setItem(DISCOVERY_KEY,JSON.stringify({version:1,entries:[...new Set(ids.filter(isEntryId))]}));return true;}catch{return false;}
}
export function discover(ids:EntryId[],id:EntryId):{entries:EntryId[];added:boolean;openedGate:boolean}{
 const added=!ids.includes(id),entries=added?[...ids,id]:ids;
 return {entries,added,openedGate:added&&!hasAllDiscoveries(ids)&&hasAllDiscoveries(entries)};
}
