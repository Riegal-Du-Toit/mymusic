import {useEffect, useRef} from 'react';

type Player = {destroy():void};
type YouTubeApi = {Player: new (element: HTMLElement, options: object) => Player};
declare global { interface Window { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void } }
let apiPromise: Promise<YouTubeApi> | undefined;
function loadApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) apiPromise = new Promise((resolve,reject) => {
    window.onYouTubeIframeAPIReady = () => window.YT?.Player ? resolve(window.YT) : reject(new Error('YouTube player unavailable'));
    const script=document.createElement('script'); script.src='https://www.youtube.com/iframe_api';
    script.onerror=()=>reject(new Error('Could not load the YouTube player.')); document.head.appendChild(script);
  });
  return apiPromise;
}
export default function YouTubePlayer({videoId,onEnded,onError}:{videoId:string,onEnded:()=>void,onError:(code:number)=>void}) {
  const container=useRef<HTMLDivElement>(null); const ended=useRef(onEnded); const error=useRef(onError);
  ended.current=onEnded; error.current=onError;
  useEffect(()=>{let cancelled=false;let player:Player|undefined;
    loadApi().then(YT=>{if(cancelled||!container.current)return;const target=document.createElement('div');container.current.replaceChildren(target);
      player=new YT.Player(target,{videoId,playerVars:{autoplay:1, ...(location.origin !== 'null' ? {origin:location.origin} : {})},events:{onStateChange:(e:{data:number})=>{if(e.data===0)ended.current()},onError:(e:{data:number})=>error.current(e.data)}});
    }).catch(()=>error.current(-1));
    return()=>{cancelled=true;player?.destroy()};
  },[videoId]);
  return <div className="youtube-player" ref={container}/>;
}
