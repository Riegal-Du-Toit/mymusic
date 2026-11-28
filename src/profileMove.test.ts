import {describe,expect,it,vi} from 'vitest';
import type {SupabaseClient} from '@supabase/supabase-js';
import {moveProfileTrack} from './profileMove';

function fakeClient(existing:object|null=null,updateError:{code:string}|null=null){
  const check={select:vi.fn().mockReturnThis(),eq:vi.fn().mockReturnThis(),maybeSingle:vi.fn().mockResolvedValue({data:existing,error:null})};
  const order={select:vi.fn().mockReturnThis(),eq:vi.fn().mockReturnThis(),order:vi.fn().mockReturnThis(),limit:vi.fn().mockResolvedValue({data:[{position:4}],error:null})};
  const update={update:vi.fn().mockReturnThis(),eq:vi.fn().mockReturnThis(),select:vi.fn().mockReturnThis(),maybeSingle:vi.fn().mockResolvedValue({data:updateError?null:{track_id:'track'},error:updateError})};
  const from=vi.fn().mockReturnValueOnce(check).mockReturnValueOnce(order).mockReturnValueOnce(update);
  return {client:{from} as unknown as SupabaseClient,from,check,order,update};
}
describe('moving a profile song',()=>{
  it('updates the existing membership and appends it after destination songs',async()=>{const db=fakeClient();expect(await moveProfileTrack(db.client,'user','source','destination','track')).toBe('moved');expect(db.update.update).toHaveBeenCalledWith({playlist_id:'destination',position:5});expect(db.update.eq).toHaveBeenCalledWith('playlist_id','source');expect(db.update.eq).toHaveBeenCalledWith('track_id','track')});
  it('leaves the original alone when the destination already contains the song',async()=>{const db=fakeClient({track_id:'track'});expect(await moveProfileTrack(db.client,'user','source','destination','track')).toBe('already-present');expect(db.from).toHaveBeenCalledTimes(1);expect(db.update.update).not.toHaveBeenCalled()});
  it('handles a duplicate created during the move without deleting the original',async()=>{const db=fakeClient(null,{code:'23505'});expect(await moveProfileTrack(db.client,'user','source','destination','track')).toBe('already-present');expect(db.update.update).toHaveBeenCalledTimes(1)});
});
