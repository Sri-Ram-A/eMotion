module.exports = {
  apps: [
    // Django Server (with venv)
    {
      name: "django-server",
      cwd: "./backend",
      script: "venv/Scripts/activate", // Path to venv Python
      args: "manage.py runserver 8000",
      interpreter: "none", // Disable default interpreter
      autorestart: true,
      watch: true,
      env: {
        PYTHONUNBUFFERED: "1",
        DJANGO_SETTINGS_MODULE: "backend.settings", // Optional
      },
    },
    // Flask App (with venv)
    {
      name: "flask-app",
      cwd: "./maps/backend",
      args: "app.py",
      interpreter: "none",
      autorestart: true,
      watch: true,
    },
    // Vite and Ngrok remain unchanged
    {
      name: "vite-preview",
      cwd: "./maps/frontend",
      script: "npx",
      args: "vite preview --host 0.0.0.0 --port 3000",
      watch: true,
    },
    {
      name: "ngrok-tunnel",
      script: "C:\\Users\\SriRam.A\\ngrok.exe",
      args: "http --url=cub-true-shiner.ngrok-free.app http://127.0.0.1:8000/",
      interpreter: "none",
    },
  ],
};