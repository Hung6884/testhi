import { contextBridge } from 'electron';

const apiKey = 'electron_api_key';
const api: any = {
  versions: process.versions,
};
contextBridge.exposeInMainWorld(apiKey, api);
