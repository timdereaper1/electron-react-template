import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import url from 'url';
import path from 'path';

function createWindow() {
	const window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			contextIsolation: true,
		},
	});
	const htmlFile = isDev
		? 'http://localhost:3000'
		: url.format({
				pathname: path.join(__dirname, 'index.html'),
				protocol: 'file:',
				slashes: true,
		  });

	window.loadURL(htmlFile);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
