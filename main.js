const electron = require('electron');
const { request } = require('http');
const path = require('path')
const url = require('url')

const createWindow = () => {
    console.log('creating...')
  const win = new electron.BrowserWindow({
    fullscreen: false,
    fullscreenable: true,
    center: true,
    title: process.env.APP_TITLE,
    webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        nodeIntegrationInSubFrames: false
    }
  })
  win.loadURL(process.env.NODE_ENV === 'production'? process.env.DOMAIN_NAME : 'localhost:5173');
}

electron.app.on("ready",() => {
  createWindow();
});