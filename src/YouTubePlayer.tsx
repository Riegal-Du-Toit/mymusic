import {useEffect, useRef, useState} from 'react';

type Player = {destroy():void;playVideo():void;pauseVideo():void;seekTo(seconds:number,allowSeekAhead:boolean):void;setVolume(volume:number):void;getCurrentTime():number;getDuration():number};
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
export default function YouTubePlayer({videoId,playbackVersion,nextRequest,onEnded,onError}:{videoId:string;playbackVersion:number;nextRequest:{title:string;requestedBy?:string}|null;onEnded:()=>void;onError:(code:number)=>void}) {
  const container=useRef<HTMLDivElement>(null); const ended=useRef(onEnded); const error=useRef(onError);
  const shell=useRef<HTMLDivElement>(null);const [fullscreen,setFullscreen]=useState(false);const [fullscreenError,setFullscreenError]=useState('');
  const playerRef=useRef<Player|null>(null);const [playing,setPlaying]=useState(false);const [ready,setReady]=useState(false);const [time,setTime]=useState(0);const [duration,setDuration]=useState(0);const [volume,setVolume]=useState(80);
  ended.current=onEnded; error.current=onError;
  useEffect(()=>{let cancelled=false;let player:Player|undefined;setReady(false);setTime(0);setDuration(0);
    loadApi().then(YT=>{if(cancelled||!container.current)return;const target=document.createElement('div');container.current.replaceChildren(target);
      player=new YT.Player(target,{videoId,playerVars:{autoplay:1, ...(location.origin !== 'null' ? {origin:location.origin} : {})},events:{onReady:(e:{target:Player})=>{playerRef.current=e.target;e.target.setVolume(volume);setReady(true)},onStateChange:(e:{data:number})=>{setPlaying(e.data===1);if(e.data===0)ended.current()},onError:(e:{data:number})=>error.current(e.data)}});
    }).catch(()=>error.current(-1));
    return()=>{cancelled=true;playerRef.current=null;player?.destroy()};
  },[videoId,playbackVersion]);
  useEffect(()=>{if(!ready)return;const timer=window.setInterval(()=>{if(playerRef.current){setTime(playerRef.current.getCurrentTime()||0);setDuration(playerRef.current.getDuration()||0)}},1000);return()=>window.clearInterval(timer)},[ready]);
  useEffect(()=>{function update(){setFullscreen(document.fullscreenElement===shell.current)}document.addEventListener('fullscreenchange',update);return()=>document.removeEventListener('fullscreenchange',update)},[]);
  async function toggleFullscreen(){setFullscreenError('');try{if(document.fullscreenElement===shell.current)await document.exitFullscreen();else if(shell.current?.requestFullscreen)await shell.current.requestFullscreen();else setFullscreenError('Full screen is not available on this device.')}catch{setFullscreenError('Could not open full screen. Please try again.')}}
  function format(seconds:number){const n=Math.floor(seconds);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`}
  return <div className="player-fullscreen-shell" ref={shell}><div className="fullscreen-layout"><div className="youtube-player" ref={container}/><div className="fullscreen-up-next" aria-live="polite"><span>UP NEXT</span>{nextRequest?<><strong>{nextRequest.title}</strong><small>Requested by {nextRequest.requestedBy||'a profile'}</small></>:<strong>No requests yet</strong>}</div></div><div className="playback-controls"><button disabled={!ready} onClick={()=>playing?playerRef.current?.pauseVideo():playerRef.current?.playVideo()}>{playing?'Pause':'Play'}</button><label>Progress <input aria-label="Seek" type="range" min={0} max={duration||0} value={Math.min(time,duration)} disabled={!duration} onChange={e=>{const value=Number(e.target.value);setTime(value);playerRef.current?.seekTo(value,true)}}/></label><span>{format(time)} / {format(duration)}</span><label>Volume <input aria-label="Volume" type="range" min={0} max={100} value={volume} onChange={e=>{const value=Number(e.target.value);setVolume(value);playerRef.current?.setVolume(value)}}/></label><button type="button" onClick={toggleFullscreen}>{fullscreen?'Exit full screen':'Full screen + up next'}</button></div>{fullscreenError&&<p role="alert">{fullscreenError}</p>}</div>;
}
