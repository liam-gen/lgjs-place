const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let win;

function sendStatusToWindow(text) {
    console.log(text);
    win.webContents.send('message', text);
  }
function createWindow() {
    win = new BrowserWindow({
        height: 600,
        width: 800,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        icon: "assets/icon.png",
        title: 'LGJS Place',
    });

    win.setTitle('LGJS Place');
    win.loadURL(`file://${__dirname}/pages/index.html#v${app.getVersion()}`);

    /* AUTO UPDATER */

    /*win.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });

    autoUpdater.on('update-available', () => {
        mainWindow.webContents.send('update_available');
    });

    autoUpdater.on('update-downloaded', () => {
        mainWindow.webContents.send('update_downloaded');
    });*/

}

/*ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });*/

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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});