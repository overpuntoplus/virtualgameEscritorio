// CONSTANTES PRINCIPALES
const {app, BrowserWindow, Tray, Menu, nativeImage, dialog} = require('electron');
const {autoUpdater} = require("electron-updater");
const isDev = require('electron-is-dev');
const gotTheLock = app.requestSingleInstanceLock();
const URLAPPWEBlink = 'https://saltapersonalizados.com/';

// VERIFICAR APLICACION UNICA
if (!gotTheLock) {
  app.quit()
} else {
	// ESTRUCTURAS PRINCIPALES
	let ventana; let catalogos; let precios; let carga; let username = process.env.username || process.env.user;
	function actualizarPrincipal() {
			ventana.maximize();
			carga.show();
			autoUpdater.checkForUpdatesAndNotify();
			ventana.loadURL(URLAPPWEBlink);
	}
	function ventanaPrincipal() {
		console.log(username);
		
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
			ventana.loadURL(URLAPPWEBlink);
			ventana.once('ready-to-show', () => {
				carga.hide();
				ventana.maximize();
				var menuSegundoPlano = Menu.buildFromTemplate([
					{ type: 'separator' },
					{ label: 'Mostrar', type: 'normal', click(){ ventana.maximize(); }},
					{ label: 'Minimizar', type: 'normal', click(){ ventana.minimize(); } },
					{ type: 'separator' },
					{ label: 'Actualizar', type: 'normal', click(){ actualizarPrincipal(); } },
					{ type: 'separator' },
					{ label: 'Cerrar', type: 'normal', click(){ if(ventana){ ventana.destroy(); } if(carga){ carga.destroy(); } if(catalogos){ catalogos.destroy(); } if(precios){ precios.destroy();} app.quit(); } },
					{ type: 'separator' }
				]);
				appIcon.setToolTip('Virtual Game');
				appIcon.setContextMenu(menuSegundoPlano);
				appIcon.on('click', function(e){
					if (ventana.isVisible()) { ventana.hide(); } else { ventana.maximize(); }
					if(catalogos!=null || precios!=null){
						catalogos.maximize();
						precios.maximize();
					}
				});
				
				
				
				
				
				if(username=="Richard"){
					ventana.hide();
					
					catalogos = new BrowserWindow({
						width: 800,
						height: 600,
						icon: 'icon.png',
						webPreferences: {
							nodeIntegration: false
						},
						show: true, frame: false
					});
					catalogos.loadURL(URLAPPWEBlink+"catalogo/juguetes/");
					catalogos.maximize();
					catalogos.once('closed', () => { catalogos=null; });
					catalogos.on('close', function (event) { event.preventDefault(); });
					precios = new BrowserWindow({
						width: 800,
						height: 600,
						icon: 'icon.png',
						webPreferences: {
							nodeIntegration: false
						},
						show: true, frame: false
					});
					precios.loadURL(URLAPPWEBlink+"precios/");
					precios.maximize();
					precios.once('closed', () => { catalogos=null; });
					precios.on('close', function (event) { event.preventDefault(); });
				}
				
				
			});
			ventana.once('closed', () => { ventana=null; });
			ventana.on('close', function (event) { event.preventDefault(); ventana.hide(); });
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
			carga.loadURL(`file://${__dirname}/carga.html#v${app.getVersion()}`);
			carga.once('closed', () => { carga=null; });
	}

	// ACTULIZACIONES 
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		if(ventana){ actualizarPrincipal(); }
	});
	function sendStatusToWindow(text){ carga.webContents.send('message', text); }
	autoUpdater.on('checking-for-update', () => { sendStatusToWindow('Verificando Actualizaciones...'); });
	autoUpdater.on('update-available', (info) => { sendStatusToWindow('Descargando Actualizacion... '); });
	autoUpdater.on('update-not-available', (info) => { if(carga){ carga.hide(); } });
	autoUpdater.on('error', (err) => { sendStatusToWindow('Error'); });
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
	autoUpdater.on('update-downloaded', (info) => { autoUpdater.quitAndInstall(); });

	// EVENTOS PRINCIPALES
	app.on('ready', ventanaPrincipal);
	app.on('ready', function(){	autoUpdater.checkForUpdatesAndNotify(); });
	app.on('window-all-closed', function (){ if (process.platform !== 'darwin') { app.quit(); } });
	app.on('activate', function (){ if (ventana === null) { ventanaPrincipal(); } });

}