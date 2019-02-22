const {app, BrowserWindow, Tray, Menu, nativeImage} = require('electron');
const {autoUpdater} = require("electron-updater");
const isDev = require("electron-is-dev");

let ventana;
let carga;

function ventanaPrincipal () {
	
	if(!isDev){
		autoUpdater.checkForUpdatesAndNotify();
	}
	
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
		carga.close();
		var menuSegundoPlano = Menu.buildFromTemplate([
			{ type: 'separator' },
			{ label: 'Abrir', type: 'normal', click(){ ventana.maximize(); }},
			{ label: 'Minimizar', type: 'normal', click(){ ventana.minimize(); } },
			{ type: 'separator' }
		]);
		appIcon.setToolTip('Virtual Game');
		appIcon.setContextMenu(menuSegundoPlano);
	});
	ventana.once('closed', () => {
		ventana=null;
	});
	
	carga = new BrowserWindow({
		width: 580,
		height: 300,
		icon: 'icon.png',
		transparent: true,
		frame: false
	});
	carga.loadFile('index.html');
	carga.once('closed', () => {
		carga=null;
	});
}

app.on('ready', ventanaPrincipal);
app.on('window-all-closed', function (){ if (process.platform !== 'darwin') { app.quit(); } });
app.on('activate', function (){ if (ventana === null) { ventanaPrincipal(); } });
