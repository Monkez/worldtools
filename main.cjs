const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Setup working directory for server dynamic files (uploads/outputs)
  const userDataPath = app.getPath('userData');
  try {
      process.chdir(userDataPath);
  } catch (err) {
      console.error('Failed to change dir:', err);
  }

  // Start the backend server directly in the main process
  // This allows it to read from app.asar transparently
  try {
      require('./server/index.js');
  } catch (err) {
      console.error('Failed to load server:', err);
  }

  // Load the frontend (which is now served by the server on port 3000)
  // Give the server a couple seconds to start up
  setTimeout(() => {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }, 1000);

  let serialCallback = null;

  mainWindow.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {
    event.preventDefault();
    serialCallback = callback;
    // Send list of ports to renderer so UI can display them
    mainWindow.webContents.send('serial-ports-list', portList);
  });

  ipcMain.on('serial-port-selected', (event, portId) => {
    if (serialCallback) {
      serialCallback(portId);
      serialCallback = null;
    }
  });

  ipcMain.on('serial-port-cancel', (event) => {
    if (serialCallback) {
      serialCallback('');
      serialCallback = null;
    }
  });

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'serial') {
      return true;
    }
    return true;
  });

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'serial') {
      return true;
    }
    return true;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
