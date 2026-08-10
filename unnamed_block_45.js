// main.js (Electron main process)
const { app, BrowserWindow, Menu, ipcMain } = require('electron');

function createWindow() {
  const win = new BrowserWindow({ webPreferences: { nodeIntegration: false, contextIsolation: true, preload: path.join(__dirname, 'preload.js') }});
  // load your app...
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);

// preload.js (expose API)
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('gemma', {
  askCopilot: (operatorRequest, context) => ipcRenderer.invoke('ask-copilot', operatorRequest, context)
});

// main process handler
ipcMain.handle('ask-copilot', async (event, operatorRequest, context) => {
  // call your local router endpoint or internal router function
  const resp = await fetch('http://localhost:3000/api/router/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operatorRequest, context })
  });
  return resp.json();
});