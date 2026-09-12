const { app, BrowserWindow, globalShortcut } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    title: 'NEON BLASTER',
    backgroundColor: '#050510',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile('shooter.html');

  // F11 toggles fullscreen, Escape handled by game itself
  globalShortcut.register('F11', () => {
    win.setFullScreen(!win.isFullScreen());
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  app.quit();
});
