import type {SupabaseClient} from '@supabase/supabase-js';

export type MoveResult='moved'|'already-present'|'check-failed'|'order-failed'|'update-failed'|'not-found'|'unknown';

/** Move the playlist membership with a single update; never delete the source first. */
export async function moveProfileTrack(client:SupabaseClient,userId:string,source:string,destination:string,trackId:string):Promise<MoveResult>{
  try{
    const existing=await client.from('playlist_tracks').select('track_id').eq('user_id',userId).eq('playlist_id',destination).eq('track_id',trackId).maybeSingle();
    if(existing.error)return 'check-failed';
    if(existing.data)return 'already-present';
    const last=await client.from('playlist_tracks').select('position').eq('user_id',userId).eq('playlist_id',destination).order('position',{ascending:false}).limit(1);
    if(last.error)return 'order-failed';
    const result=await client.from('playlist_tracks').update({playlist_id:destination,position:(last.data?.[0]?.position??-1)+1}).eq('user_id',userId).eq('playlist_id',source).eq('track_id',trackId).select('track_id').maybeSingle();
    if(result.error)return result.error.code==='23505'?'already-present':'update-failed';
    return result.data?'moved':'not-found';
  }catch{return 'unknown'}
}
