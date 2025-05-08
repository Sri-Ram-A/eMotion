@echo off
wt ^
    -p "Command Prompt" -d . cmd /k "cd backend && python manage.py runserver" ^
    ; new-tab -p "Command Prompt" -d . cmd /k "cd frontend-driver && npm run start -- --port 3000" ^
    ; new-tab -p "Command Prompt" -d . cmd /k "cd frontend-rider && npm run start -- --port 5000"
