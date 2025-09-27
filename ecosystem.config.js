const NODE = process.execPath;
module.exports = {
  apps: [
    {
      name: "fe-dev",
      cwd: "./webadmin",
      script: "node",
      args: ["./node_modules/umi/bin/umi.js", "dev", "--no-open"],
      env: { NODE_ENV: "development", PORT: 8000 },
      watch: false,
      autorestart: false
    },

     {
      name: "be-dev",
      cwd: "./backend",
      script: NODE,
      args: [
        "./node_modules/nodemon/bin/nodemon.js",
        "--watch", "src",
        "--ext", "js,json",
        "--exec", "node -r dotenv/config ./src/index.js"  
      ],
      env: { NODE_ENV: "development", APP_PORT: 3000 },
      windowsHide: true,
      watch: false,
      autorestart: true
    }
  ]
};
