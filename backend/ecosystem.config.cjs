module.exports = {
  apps: [
    {
      name: 'repair-shop-backend',
      script: 'src/server.js',              // Backend entry point
      cwd: '/var/www/app/backend',          // Backend folder on the server
      exec_mode: 'fork',                    // MUST be 'fork' on single-core t2.micro
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
