export function youtubeVideoId(input:string):string|null {
  try {
    const url=new URL(input);
    const host=url.hostname.replace(/^www\./,'');
    const id=host==='youtu.be' ? url.pathname.split('/')[1] : ['youtube.com','music.youtube.com','m.youtube.com'].includes(host) ? (url.searchParams.get('v')||url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1]) : null;
    return id&&/^[\w-]{11}$/.test(id)?id:null;
  } catch {return null}
}
export function matchesSearch(track:{title:string;artist:string},query:string):boolean {
  return `${track.title} ${track.artist}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}
export function moveTrack(ids:string[],source:string,target:string):string[]{
  const from=ids.indexOf(source),to=ids.indexOf(target);
  if(from<0||to<0||from===to)return [...ids];
  const next=[...ids];next.splice(from,1);next.splice(to,0,source);return next;
}
export function insertPlayNext<T extends {requested?:boolean}>(queue:T[],currentIndex:number,request:T):T[]{
  const next=[...queue];let position=Math.max(0,currentIndex+1);
  while(position<next.length&&next[position].requested)position++;
  next.splice(position,0,request);return next;
}
export function isSongInActiveQueue<T extends {id:string}>(queue:T[],currentIndex:number,songId:string,finished:boolean):boolean{
  const start=finished?currentIndex+1:Math.max(0,currentIndex);
  return queue.slice(start).some(song=>song.id===songId);
}
export function startQueueKeepingRequests<T extends {id:string;requested?:boolean}>(songs:T[],queue:T[],currentIndex:number):T[]{
  if(!songs.length)return [...queue];
  const ordered=[songs[0],...queue.slice(currentIndex+1).filter(song=>song.requested),...songs.slice(1)];
  const seen=new Set<string>();return ordered.filter(song=>{if(seen.has(song.id))return false;seen.add(song.id);return true});
}
