const { app, BrowserWindow } = require('electron');
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
      contextIsolation: true
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
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
