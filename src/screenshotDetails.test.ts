import {describe,expect,it} from 'vitest';
import {extractScreenshotDetails} from './screenshotDetails';

const profiles=[{id:'80',name:"80's"},{id:'90',name:"90's"},{id:'karaoke',name:'Karaoke'}];
describe('screenshot text review',()=>{
  it('extracts a visible link and suggests the matching decade',()=>{expect(extractScreenshotDetails('youtube.com/watch?v=KxdpFBJKFOg','Clubland 90s - CD3','CLUBLAND 90S',profiles)).toEqual({url:'https://www.youtube.com/watch?v=KxdpFBJKFOg',title:'Clubland 90s - CD3',profileId:'90'})});
  it('supports short links and punctuation in profile names',()=>{expect(extractScreenshotDetails('https://youtu.be/abcdefghijk','Songs of the 80s','',profiles)).toEqual({url:'https://www.youtube.com/watch?v=abcdefghijk',title:'Songs of the 80s',profileId:'80'})});
  it('does not invent a missing or truncated link',()=>{expect(extractScreenshotDetails('youtube.com/watch?v=abc','Clubland 90s','90s',profiles).url).toBe('')});
  it('does not guess between conflicting profiles',()=>{expect(extractScreenshotDetails('','Dance mix','80s and 90s',profiles).profileId).toBeNull()});
});
