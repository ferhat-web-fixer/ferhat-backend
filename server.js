const http = require('http');
const redis = require('redis'); 

// Redis bağlantısı. 
// Railway'de çalışıyorsak (REDIS_URL ve REDIS_PASSWORD varsa) onları kullan, 
// Lokaldeysek varsayılan adresi (redis:6379) kullan.
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
  password: process.env.REDIS_PASSWORD || undefined // NOAUTH hatası çözüldü
});

// Sayacı başlat
let visits = 0;

client.on('error', (err) => console.log('Redis Client Error', err));

// Sunucuyu başlatmadan önce Redis'e bağlan
client.connect().then(() => {
    console.log('Redis bağlantısı başarılı.');
    
    // Redis'ten ziyaretçi sayısını çek ve sayacı başlat
    client.get('visits').then((count) => {
        visits = parseInt(count) || 0;
        console.log(`Mevcut ziyaretçi sayısı: ${visits}`);

        const hostname = '0.0.0.0';
        const port = process.env.PORT || 8080;

        const server = http.createServer((req, res) => {
            if (req.url === '/') {
                // Sayacı artır ve Redis'e kaydet
                visits++;
                client.set('visits', visits.toString());

                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                // En son eklediğimiz emoji de burada
                res.end(`Merhaba Ferhat! Sayfa ziyaret sayaci: ${visits} 🤖\n`); 
            } else if (req.url === '/hello') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Hello Ferhat!');
            } else {
                res.statusCode = 404;
                res.end('Sayfa bulunamadı.');
            }
        });

        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });

    });
});