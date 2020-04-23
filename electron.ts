import { session } from "electron";
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow: Electron.BrowserWindow | null;

app.allowRendererProcessReuse = true;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });
    mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
    createWindow();

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders["User-Agent"] =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36";
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
    session.defaultSession.cookies.set({ url: "https://www.1396r.com", name: "ccsalt", value: "619a55a254ca3f023899bc6aafbae0a4" }).then(
        () => {
            // success
        },
        (error) => {
            console.error(error);
        }
    );
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
