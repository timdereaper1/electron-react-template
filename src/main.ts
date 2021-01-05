import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';

let win: BrowserWindow | null = null;

function createWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
		},
	});

	if (isDev) {
		win.loadURL('http://localhost:3000');
	} else {
		win.loadURL(`file://${__dirname}/../index.html`);
	}

	win.on('closed', () => {
		win = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});
