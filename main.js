const { app, BrowserWindow, screen, desktopCapturer, Menu, Tray, globalShortcut } = require('electron');
const path = require('path');

let win;
let tray = null;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().bounds;

  win = new BrowserWindow({
    width, height, x: 0, y: 0,
    frame: false, transparent: true, alwaysOnTop: true, skipTaskbar: true,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });

  win.setIgnoreMouseEvents(true, { forward: true });
  win.loadFile('index.html');

  globalShortcut.register('CommandOrControl+Alt+O', () => {
    win.isVisible() ? win.hide() : win.show();
  });

  try {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'LightGuard Actief', enabled: false },
      { label: 'Aan/Uit (Ctrl+Alt+O)', click: () => { win.isVisible() ? win.hide() : win.show(); }},
      { label: 'Afsluiten', click: () => app.quit() }
    ]);
    tray.setContextMenu(contextMenu);
  } catch (e) { console.log("Geen icoon gevonden."); }

  setInterval(async () => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 10, height: 10 } });
      if (sources.length > 0) {
        const img = sources[0].thumbnail.toBitmap();
        let bSum = 0;
        for (let i = 0; i < img.length; i += 4) { bSum += img[i]; }
        win.webContents.send('update-blue', bSum / (img.length / 4));
      }
    } catch (e) {}
  }, 2000);
}

app.whenReady().then(createWindow);
app.on('will-quit', () => { globalShortcut.unregisterAll(); });