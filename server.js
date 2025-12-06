const http = require('http');
const redis = require('redis'); 
const { URL } = require('url'); // URL modülünü dahil ediyoruz

// Redis bağlantısını özelleştiriyoruz
let redisOptions = {
    // Sadece RailWay'in sağladığı URL'i kullanıyoruz.
    url: process.env.REDIS_URL || 'redis://redis:6379'
};

// RailWay'in şifreli URL'ini ayrıştırıp şifreyi Redis bağlantısına aktarıyoruz
if (process.env.REDIS_URL) {
    try {
        const url = new URL(process.env.REDIS_URL);
        // Eğer URL'de bir şifre varsa (RailWay'den gelen linklerde var)
        if (url.password) {
            // Şifreyi doğrudan password alanına atıyoruz
            redisOptions.password = url.password;
        }
    } catch (e) {
        console.error("REDIS_URL ayrıştırılırken hata oluştu, sadece URL kullanılacak.");
        // Ayrıştırma hatası olsa bile uygulamayı çökertmiyoruz
    }
}

const client = redis.createClient(redisOptions);

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

        // Ağ hatasını çözen kısım: 0.0.0.0'ı kullanıyoruz
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
        // Eğer NOAUTH hatası burada tekrar çıkarsa, bu logu görürüz
        console.error("Redis'ten ilk veriyi çekerken hata:", err);
    });
}).catch(err => {
    // Eğer Redis'e bağlanamazsa, uygulama çöker
    console.error("Redis bağlantı hatası: Uygulama çöktü.", err);
    process.exit(1);
});