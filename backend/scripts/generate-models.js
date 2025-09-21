
const { SequelizeAuto } = require('sequelize-auto');
require('dotenv').config();

(async () => {
  const db = process.env.DATABASE || 'fastex_v3';
  const user = process.env.DB_USERNAME || 'quangnh';
  const pass = process.env.DB_PASSWORD || 'Metatek@#2024';
  const host = process.env.DB_HOST || '103.61.121.161';
  const port = Number(process.env.DB_PORT || 3306);

  const outDir = './src/database/models';

  const auto = new SequelizeAuto(db, user, pass, {
    host,
    port,
    dialect: 'mysql',
    directory: outDir,              
    caseModel: 'p',                  
    caseFile: 'c',                  
    singularize: true,              
    additional: {
      timestamps: false,            
      underscored: true,             
    },
    noAlias: true,                   
    lang: 'es5',                     
  });

  try {
    const data = await auto.run();
    console.log(` Generated models for ${Object.keys(data.tables).length} tables at ${outDir}`);

  } catch (err) {
    console.error(' Generate failed:', err.message);
    process.exit(1);
  }
})();
