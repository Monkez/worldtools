const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onSerialPortsList: (callback) => ipcRenderer.on('serial-ports-list', (_event, ports) => callback(ports)),
    selectSerialPort: (portId) => ipcRenderer.send('serial-port-selected', portId),
    cancelSerialPort: () => ipcRenderer.send('serial-port-cancel')
});
