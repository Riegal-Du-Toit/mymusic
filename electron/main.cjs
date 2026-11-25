const {app,BrowserWindow}=require('electron');
const path=require('node:path');
app.whenReady().then(()=>{const win=new BrowserWindow({width:1280,height:800,webPreferences:{contextIsolation:true,sandbox:true,nodeIntegration:false}});win.webContents.setWindowOpenHandler(()=>({action:'deny'}));win.loadFile(path.join(__dirname,'../dist/index.html'));});
app.on('window-all-closed',()=>app.quit());
