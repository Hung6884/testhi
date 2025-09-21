const { contextBridge } = require('electron');

const apiKey = 'electron_api_key';

const api = {
  versions: process.versions,
};

contextBridge.exposeInMainWorld(apiKey, api);
