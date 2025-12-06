const http = require('http');
const redis = require('redis'); 

// Redis bağlantısı. 
// Railway'de REDIS_URL ve şifreyi kullanır. 
// NOAUTH hatasını çözmek için hem REDISPASSWORD hem de REDIS_PASSWORD değişkenlerini deniyoruz.
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379'
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

        // AĞ HATASINI ÇÖZEN KISIM: 0.0.0.0'ı yeniden ekliyoruz
        const hostname = '0.0.0.0'; 
        const port = process.env.PORT || 8080;

        const server = http.createServer((req, res) => {
            if (req.url === '/') {
                // Sayacı artır ve Redis'e kaydet
                visits++;
                client.set('visits', visits.toString());

                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                // Final çıktı
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

    }).catch(err => {
        console.error("Redis'ten ilk veriyi çekerken hata:", err);
    });
}).catch(err => {
    console.error("Redis bağlantı hatası: Uygulama çöktü.", err);
    process.exit(1);
});