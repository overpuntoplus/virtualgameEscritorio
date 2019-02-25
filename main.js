const {app, BrowserWindow, Tray, Menu, nativeImage} = require('electron');
const {autoUpdater} = require("electron-updater");


let ventana;
let carga;
let win;



function sendStatusToWindow(text) {
  win.webContents.send('message', text);
}
function createDefaultWindow() {
  win = new BrowserWindow();
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return win;
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});




function ventanaPrincipal () {
	createDefaultWindow();
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
app.on('ready', function()  {
	autoUpdater.checkForUpdatesAndNotify();
});
app.on('window-all-closed', function (){ if (process.platform !== 'darwin') { app.quit(); } });
app.on('activate', function (){ if (ventana === null) { ventanaPrincipal(); } });
