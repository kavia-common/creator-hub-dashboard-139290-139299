#!/bin/bash
cd /home/kavia/workspace/code-generation/creator-hub-dashboard-139290-139299/dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

