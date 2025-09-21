const { protocol } = require('electron');
const path = require('path');
const { URL } = require('url');

module.exports = (scheme) => {
  protocol.registerFileProtocol(scheme, (request, respond) => {
    let pathName = new URL(request.url).pathname;
    pathName = decodeURI(pathName); // Needed in case URL contains spaces

    const filePath = path.join(__dirname, pathName);
    respond({ path: filePath });
  });
};
