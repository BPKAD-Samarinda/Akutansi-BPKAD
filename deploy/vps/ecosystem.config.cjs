module.exports = {
  apps: [
    {
      name: "bpkad-api",
      cwd: "/var/www/akuntansi-bpkad/backend",
      script: "dist/index.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
