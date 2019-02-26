const {app, BrowserWindow, Tray, Menu, nativeImage} = require('electron');
const {autoUpdater} = require("electron-updater");


let ventana;
let carga;



function sendStatusToWindow(text) {
  carga.webContents.send('message', text);
}


autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Verificando Actualizaciones...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Actualizacion Disponible!');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Actualizaciones al dia.');
  carga.close();
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error');
})
autoUpdater.on('download-progress', (progressObj) => {
  function niceBytes(x,xx=true){
      var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        n = parseInt(x, 10) || 0, 
        l = 0; 
      if(n > 1024)
        do{l++} while((n/=1024) > 1024);
	if(xx==true){
      return(n.toFixed(n >= 10 ? 0 : 1) + ' ' + units[l]);
	}else{
		return(n.toFixed(n >= 10 ? 0 : 1));
	}	
  }
  
  let log_message="Actualizando... "+ parseInt(progressObj.percent)+"% ...("+niceBytes(progressObj.transferred, false)+"/"+niceBytes(progressObj.total)+") "+niceBytes(progressObj.bytesPerSecond);
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Descarga Finalizada');
  carga.close();
});




function ventanaPrincipal () {
	const path = require('path');
	const iconPath = path.join(__dirname, 'icon.png');
	const trayIcon = nativeImage.createFromPath(iconPath);
	const appIcon = new Tray(trayIcon);
	
	ventana = new BrowserWindow({
		width: 800,
		height: 600,
		icon: 'icon.png',
		webPreferences: {
			nodeIntegration: false
		},
		show: false, frame: false
	});
	ventana.loadURL('https://saltapersonalizados.com/')
	ventana.once('ready-to-show', () => {
		ventana.maximize();
		var menuSegundoPlano = Menu.buildFromTemplate([
			{ type: 'separator' },
			{ label: 'Abrir', type: 'normal', click(){ ventana.maximize(); }},
			{ label: 'Minimizar', type: 'normal', click(){ ventana.minimize(); } },
			{ type: 'separator' }
		]);
		appIcon.setToolTip('Virtual Game');
		appIcon.setContextMenu(menuSegundoPlano);
	});
	ventana.once('closed', () => { ventana=null; });
	carga = new BrowserWindow({
		width: 580,
		height: 300,
		icon: 'icon.png',
		webPreferences: {
			nodeIntegration: true
		},
		transparent: true,
		frame: false
	});
	carga.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`);
	carga.once('closed', () => { carga=null; });
}











app.on('ready', ventanaPrincipal);
app.on('ready', function(){	autoUpdater.checkForUpdatesAndNotify(); });
app.on('window-all-closed', function (){ if (process.platform !== 'darwin') { app.quit(); } });
app.on('activate', function (){ if (ventana === null) { ventanaPrincipal(); } });
