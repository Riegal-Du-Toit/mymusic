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
