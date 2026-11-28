import {useState, type ReactNode} from 'react';

export type LibrarySong={id:string;title:string;artist:string;favourite:boolean};
type Props<T extends LibrarySong>={songs:T[];selected:string[];editingId:string|null;onToggle:(song:T,checked:boolean)=>void;onPlay:(song:T)=>void;onPlayNext:(song:T)=>void;onFavourite:(song:T)=>void;onEdit:(song:T)=>void;onRemove:(song:T)=>void;renderEditor:(song:T)=>ReactNode};

export default function LibraryShowcase<T extends LibrarySong>({songs,selected,editingId,onToggle,onPlay,onPlayNext,onFavourite,onEdit,onRemove,renderEditor}:Props<T>){
  const [active,setActive]=useState<string|null>(null);
  const preview=songs.slice(0,9);
  return <div className="library-showcase">
    <div className="library-showcase-art" aria-label="Song artwork">
      {[0,1,2].map(column=><div className="library-art-column" key={column}>{preview.filter((_,i)=>i%3===column).map(song=><button type="button" key={song.id} className={'library-art-card '+(active===song.id?'is-active':'')+(active&&active!==song.id?' is-dimmed':'')} onMouseEnter={()=>setActive(song.id)} onMouseLeave={()=>setActive(null)} onFocus={()=>setActive(song.id)} onBlur={()=>setActive(null)} onClick={()=>onPlay(song)} aria-label={`Play ${song.title}`}><span aria-hidden="true">♫</span><img src={`https://i.ytimg.com/vi/${song.id}/mqdefault.jpg`} alt="" loading="lazy" onError={event=>{event.currentTarget.style.display='none'}}/></button>)}</div>)}
    </div>
    <div className="library-showcase-list" aria-label="Songs">{songs.map(song=><div key={song.id}><div className={'library-showcase-row '+(active===song.id?'is-active':'')+(active&&active!==song.id?' is-dimmed':'')} onMouseEnter={()=>setActive(song.id)} onMouseLeave={()=>setActive(null)} onFocus={()=>setActive(song.id)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setActive(null)}}><input type="checkbox" aria-label={`Select ${song.title}`} checked={selected.includes(song.id)} onChange={event=>onToggle(song,event.target.checked)}/><button type="button" className="library-song-name" onClick={()=>onPlay(song)}><strong>{song.title}</strong><small>{song.artist||'Unknown artist'}</small></button><button type="button" className="library-row-action" onClick={()=>onPlayNext(song)} aria-label={`Add ${song.title} to queue`}>Add to queue</button><button type="button" className="library-row-action" aria-label={`${song.favourite?'Remove':'Add'} ${song.title} ${song.favourite?'from':'to'} favourites`} onClick={()=>onFavourite(song)}>{song.favourite?'♥':'♡'}</button><button type="button" className="library-row-action" onClick={()=>onEdit(song)} aria-label={`Edit ${song.title}`}>Edit</button><button type="button" className="library-row-action" onClick={()=>onRemove(song)} aria-label={`Remove ${song.title}`}>×</button></div>{editingId===song.id&&renderEditor(song)}</div>)}</div>
  </div>;
}
