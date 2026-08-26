const { app, ipcMain, BrowserWindow } = require('electron');
const { BrowserWindow: aero } = require('electron-acrylic-window');
const { qKeys, qHotkeys } = require('qHotkeys');

const path = require('path');
var hotkeys = new qHotkeys();

//let mainWindow;
let windows = new Set();
let window = null;

function createWindow() {
  let collageWindow = new BrowserWindow({
    width: 780,
    height: 240,
    frame: true,
    transparent: true,
    titleBarStyle: 'hidden',
    fullscreen: true,
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#ffffff',
      height: 20
    },
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, '../renderer/mainPreload.js')
    }
  });

  window = new BrowserWindow({
    width: 780,
    height: 240,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/mainPreload.js')
    }
  });
  /*
  let chatWindow = new BrowserWindow({
    width: 780,
    height: 640,
    frame: true,
    transparent: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#ffffff',
      height: 20
    },
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, '../renderer/mainPreload.js')
    }
  });
  let captionWindow = new BrowserWindow({
    width: 1300,
    height: 580,
    frame: true,
    transparent: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#ffffff',
      height: 20
    },
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, '../renderer/mainPreload.js')
    }
  });
  let commandsWindow = new BrowserWindow({
    width: 300,
    height: 380,
    frame: true,
    transparent: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#ffffff',
      height: 20
    },
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, '../renderer/mainPreload.js')
    }
  });
  let bannerWindow = new BrowserWindow({
    width: 1300,
    height: 220,
    frame: false,
    vibrancy: {
      theme: '#12345678',
      effect: 'blur',
      useCustomWindowRefreshMethod: true,
      disableOnBlur: false,
      debug: false
    },
    transparent: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#ffffff',
      height: 20
    },
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      backgroundThrottling: false,
      preload: path.join(__dirname, '../renderer/mainPreload.js')
    }
  });
  let titleWindow = new BrowserWindow({
    width: 1300,
    height: 230,
    frame: false,
    vibrancy: {
      theme: '#12345678',
      effect: 'blur',
      useCustomWindowRefreshMethod: true,
      disableOnBlur: false,
      debug: false
    },
    transparent: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#ffffff',
      height: 20
    },
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      backgroundThrottling: false,
      preload: path.join(__dirname, '../renderer/mainPreload.js')
    }
  });*/
  windows.add(window);
  windows.add(collageWindow);
  /*
  windows.add(chatWindow);
  windows.add(captionWindow);
  windows.add(bannerWindow);
  windows.add(titleWindow);
  windows.add(commandsWindow);
*/
  window.on('closed', () => {
    windows.delete(window);
    windows.delete(collageWindow);
    /*windows.delete(chatWindow);
    windows.delete(captionWindow);
    windows.delete(bannerWindow);
    windows.delete(titleWindow);
    windows.delete(commandsWindow);*/
    window = collageWindow = null;
    /* chatWindow = captionWindow = bannerWindow = titleWindow = commandsWindow = null; */
  });
  // this line works with builds
  // mainWindow.loadFile('dist/index.html')
  collageWindow.loadURL('http://localhost:5173/collage');
  window.loadURL('http://localhost:5173');
  /*
  chatWindow.loadURL('http://localhost:5173/chat');
  captionWindow.loadURL('http://localhost:5173/captions');
  bannerWindow.loadURL('http://localhost:5173/banner');
  titleWindow.loadURL('http://localhost:5173/title');
  commandsWindow.loadURL('http://localhost:5173/commands'); */

  //ipcMain.handle('new:window', newWindow)
}

app.whenReady().then(() => {
  createWindow();

  const commandCTRL_A = () => {
    window.webContents.send('update-command', 'ctrl + a');
  };
  const commandCTRL_C = () => {
    window.webContents.send('update-command', 'ctrl + c');
  };
  const commandCTRL_F = () => {
    window.webContents.send('update-command', 'ctrl + f');
  };
  const commandCTRL_N = () => {
    console.log('sending n');
    window.webContents.send('update-command', 'ctrl + n');
  };
  const commandCTRL_S = () => {
    window.webContents.send('update-command', 'ctrl + s');
  };

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    /*
    app.on("activate", () => {
      if (windows.size === 0) {
        createWindow();
      }
    }); 
    */
  });
  hotkeys.register([qKeys.CmdOrCtrl, qKeys.A], commandCTRL_A);
  hotkeys.register([qKeys.CmdOrCtrl, qKeys.C], commandCTRL_C);
  hotkeys.register([qKeys.CmdOrCtrl, qKeys.F], commandCTRL_F);
  hotkeys.register([qKeys.CmdOrCtrl, qKeys.N], commandCTRL_N);
  hotkeys.register([qKeys.CmdOrCtrl, qKeys.S], commandCTRL_S);

  //hotkeys.register([qKeys.W, qKeys.Q], hotkeyAction(`WIN + Q`));
  hotkeys.run();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

/*const newWindow = () => {
  const newBrowserWindow = new BrowserWindow({
    width: 400,
    height: 400
  })
  newBrowserWindow.loadURL('https://dealingwithdevelop.link')
}*/
