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

  // Start the backend server
  const serverPath = path.join(__dirname, 'server', 'index.js');
  if (fs.existsSync(serverPath)) {
      serverProcess = fork(serverPath, [], {
          cwd: path.join(__dirname, 'server'),
          env: process.env
      });
  } else {
      console.error('Server file not found at:', serverPath);
  }

  // Load the frontend (which is now served by the server on port 3000)
  // Give the server a couple seconds to start up
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 1500);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
    if (serverProcess) serverProcess.kill();
});
