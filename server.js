const http = require('http');
const redis = require('redis'); 

// Redis bağlantısı. 
// NOAUTH hatasını çözmek için hem REDISPASSWORD hem de REDIS_PASSWORD değişkenlerini deniyoruz.
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
  password: process.env.REDISPASSWORD || process.env.REDIS_PASSWORD || undefined 
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

        // PORT hatasını çözmek için: Railway her zaman PORT değişkenini kullanır.
        const hostname = '0.0.0.0';
        const port = process.env.PORT || 8080; // Railway'deki PORT'u dinle!

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
        // Eğer Redis'ten veri çekilirken hata olursa, sunucuyu yine de başlat
        console.error("Redis'ten ilk veriyi çekerken hata:", err);
        // Hata durumunda bile uygulamanın tamamen çökmesini engellemek için buraya ek bir sunucu başlatma mantığı eklenebilir, 
        // ancak şimdilik mevcut yapıyı koruyoruz.
    });
}).catch(err => {
    // Eğer Redis'e bağlanamazsa, hata mesajı yaz ve çök
    console.error("Redis bağlantı hatası: Uygulama çöktü.", err);
    process.exit(1); // Uygulamayı sonlandır (Railway yeniden başlatacaktır)
});