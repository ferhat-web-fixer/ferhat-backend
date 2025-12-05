#!/bin/bash

URL="http://ferhat-backend-production.up.railway.app"

echo "Test başlatılıyor..."

for i in {1..5}; do
  echo "İstek $i: /"
  curl -s $URL/
  echo -e "\n"

  echo "İstek $i: /api"
  curl -s $URL/api
  echo -e "\n"
done

echo "Test tamamlandı. Logs ve Metrics panelinden container durumunu gözlemle."
