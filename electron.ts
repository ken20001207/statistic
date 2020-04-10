import * as electron from "electron";

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.allowRendererProcessReuse = true;

export var mainWindow: electron.BrowserWindow;

import { session } from "electron";

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });
  mainWindow.loadFile("index.html");
  mainWindow.setMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["User-Agent"] =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36";
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
