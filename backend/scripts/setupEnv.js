const collectComponentRenderer = require('./collectComponentRenderer');
const convertEnvToJSON = require('./convertEnvToJSON');
const eslintToJSON = require('./eslintrcToJSON');
const jsconfigToJSON = require('./jsconfigToJSON');

convertEnvToJSON();
eslintToJSON();
jsconfigToJSON();
collectComponentRenderer();
