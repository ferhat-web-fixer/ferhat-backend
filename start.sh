#!/bin/bash

# Eski container'ları durdur ve sil
docker stop $(docker ps -aq) 2>/dev/null
docker rm $(docker ps -aq) 2>/dev/null

# Eski image'ları temizle (opsiyonel)
docker rmi $(docker images -q) 2>/dev/null

# Yeni image'ı build et
docker build -t ferhat-pack-image .

# Container'ı arka planda çalıştır
docker run -d -p 3000:3000 ferhat-pack-image

echo "✅ Node container çalışıyor! Tarayıcıdan http://localhost:3000 açabilirsin."
