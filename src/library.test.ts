import {describe,expect,it} from 'vitest';
import {matchesSearch,youtubeVideoId} from './library';
describe('YouTube links',()=>{
  it('accepts normal, short and music video links',()=>{for(const link of ['https://www.youtube.com/watch?v=abcdefghijk','https://youtu.be/abcdefghijk?t=20','https://music.youtube.com/watch?v=abcdefghijk','https://youtube.com/shorts/abcdefghijk'])expect(youtubeVideoId(link)).toBe('abcdefghijk')});
  it('rejects misleading hosts and malformed ids',()=>{for(const link of ['https://youtube.com.evil.test/watch?v=abcdefghijk','https://youtube.com/watch?v=bad','not a URL','https://youtube.com/playlist?list=abcdefghijk'])expect(youtubeVideoId(link)).toBeNull()});
});
describe('profile search',()=>{it('matches title and artist without case sensitivity',()=>{const track={title:'Blue Sky',artist:'The Band'};expect(matchesSearch(track,' BLUE ')).toBe(true);expect(matchesSearch(track,'band')).toBe(true);expect(matchesSearch(track,'other')).toBe(false)})});
