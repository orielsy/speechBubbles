const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (callback) =>
    ipcRenderer.on('update-command', (_event, value) => callback(value)),
  counterValue: (value) => ipcRenderer.send('command-value', value)
});
