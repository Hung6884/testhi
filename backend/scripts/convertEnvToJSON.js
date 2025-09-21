const path = require('path');
const fs = require('fs');
const pickBy = require('lodash/pickBy');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

function convertEnvToJSON() {
  try {
    let envContent = '';
    try {
      envContent = fs.readFileSync(path.join(__dirname, '../.env')).toString();
    } catch (_error) {}
    const outputEnv = path.join(__dirname, '../public/env.json');
    try {
      fs.mkdirSync(path.dirname(outputEnv), { recursive: true });
    } catch {}

    fs.writeFileSync(
      outputEnv,
      JSON.stringify(
        pickBy(process.env, (value, key) => {
          return envContent ? envContent.includes(`${key}=`) : true;
        }),
        null,
        2,
      ),
      {
        flag: 'w',
      },
    );
  } catch (_error) {
    console.log('Can not convert env to file JS', _error);
  }
}

module.exports = convertEnvToJSON;
