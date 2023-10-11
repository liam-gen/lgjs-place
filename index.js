const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require("fs");

function createWindow() {
    const win = new BrowserWindow({
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
    win.loadFile("pages/index.html");
}

ipcMain.on("get-apps", function(e){
    const {getAllInstalledSoftware} = require("fetch-installed-software")

    getAllInstalledSoftware().then(apps => {
        e.sender.send("return-apps", apps)
        let data = JSON.parse(fs.readFileSync(__dirname+"/cache/cache.json", "utf-8"))
        data["installed_apps_number"] = apps.length;
        console.log(data)
        fs.writeFileSync(__dirname+"/cache/cache.json", JSON.stringify(data))
    })
})

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});