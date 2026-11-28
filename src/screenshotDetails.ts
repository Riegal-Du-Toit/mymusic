export type ScreenshotProfile={id:string;name:string};
export type ScreenshotDetails={url:string;title:string;profileId:string|null};

function normaliseWords(text:string):string{
  return text.toLocaleLowerCase().replace(/\b(\d{2})\s*['’]?\s*s\b/g,'$1s').replace(/[^a-z0-9]+/g,' ').trim();
}

export function extractScreenshotDetails(addressText:string,titleText:string,fullText:string,profiles:ScreenshotProfile[]):ScreenshotDetails{
  const compact=addressText.replace(/\s*([/?=&])\s*/g,'$1');
  const match=compact.match(/(?:https?:\/\/)?(?:(?:www|music|m)\.)?youtube\.com\/watch\?[^\s#]*?\bv=([\w-]{11})(?![\w-])/i)??compact.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([\w-]{11})(?![\w-])/i);
  const url=match?`https://www.youtube.com/watch?v=${match[1]}`:'';
  const lines=titleText.split(/\r?\n/).map(line=>line.trim()).filter(line=>line.length>=5&&/[a-z]{2}/i.test(line)&&!/(youtube\.com|youtu\.be|https?:|subscribers|views|comments|recommended|sign in)/i.test(line));
  const title=lines.at(-1)??'';
  function findProfile(text:string){const haystack=` ${normaliseWords(text)} `;const matches=profiles.filter(profile=>{const name=normaliseWords(profile.name);return name.length>=3&&haystack.includes(` ${name} `)});return matches.length===1?matches[0].id:null}
  return {url,title,profileId:findProfile(title)??findProfile(fullText)};
}
