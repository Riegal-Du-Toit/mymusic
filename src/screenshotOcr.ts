import {createWorker,PSM} from 'tesseract.js';
import workerAsset from 'tesseract.js/dist/worker.min.js?url';
import coreAsset from 'tesseract.js-core/tesseract-core-lstm.wasm.js?url';
import modelAsset from '@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz?url';

function crop(image:ImageBitmap,left:number,top:number,width:number,height:number):HTMLCanvasElement{
  const sourceWidth=Math.max(1,Math.round(image.width*width));const sourceHeight=Math.max(1,Math.round(image.height*height));
  const scale=Math.min(2,2200/sourceWidth);const canvas=document.createElement('canvas');canvas.width=Math.round(sourceWidth*scale);canvas.height=Math.round(sourceHeight*scale);
  const context=canvas.getContext('2d');if(!context)throw new Error('Could not read the screenshot.');
  context.drawImage(image,Math.round(image.width*left),Math.round(image.height*top),sourceWidth,sourceHeight,0,0,canvas.width,canvas.height);return canvas;
}

export async function readScreenshot(file:File,onProgress:(message:string)=>void):Promise<{addressText:string;titleText:string;fullText:string}>{
  if(!file.type.startsWith('image/'))throw new Error('Choose an image file.');
  if(file.size>25*1024*1024)throw new Error('Please choose an image smaller than 25 MB.');
  const bitmap=await createImageBitmap(file);let worker:Awaited<ReturnType<typeof createWorker>>|undefined;
  try{
    if(bitmap.width*bitmap.height>40000000)throw new Error('The image is too large to read. Please use a smaller screenshot.');
    onProgress('Loading text recognition…');
    const modelDirectory=new URL('.',new URL(modelAsset,document.baseURI)).href;
    let expired=false;let timer=0;
    const loading=createWorker('eng',undefined,{workerPath:new URL(workerAsset,document.baseURI).href,corePath:new URL(coreAsset,document.baseURI).href,langPath:modelDirectory,workerBlobURL:false,cacheMethod:'none'});
    void loading.then(lateWorker=>{if(expired)void lateWorker.terminate()}).catch(()=>{});
    try{worker=await Promise.race([loading,new Promise<never>((_,reject)=>{timer=window.setTimeout(()=>{expired=true;reject(new Error('Text recognition took too long to start. Refresh and try again.'))},60000)})])}finally{window.clearTimeout(timer)}
    await worker.setParameters({tessedit_pageseg_mode:PSM.SPARSE_TEXT});
    onProgress('Reading the video link…');const address=await worker.recognize(crop(bitmap,0,0,1,0.2));
    onProgress('Reading the title…');const title=await worker.recognize(crop(bitmap,0,0.68,0.7,0.32));
    onProgress('Looking for a profile…');const full=await worker.recognize(crop(bitmap,0,0,1,1));
    return {addressText:address.data.text,titleText:title.data.text,fullText:full.data.text};
  } finally {bitmap.close();if(worker)await worker.terminate()}
}
