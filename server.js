console.log("Seni seviyorum Rabia!"); // Yeni mesaj

const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8'); // Türkçe karakterler için
    res.end('Merhaba Ferhat! Node container çalışıyor.\nDeğişiklikler yüklendi!\nSeni seviyorum Rabia!\n');
  } else if (req.url === '/api') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ message: 'API endpoint çalışıyor ve güncel! Seni seviyorum Rabia!' }));
  } else {
    res.statusCode = 404;
    res.end('Sayfa bulunamadı.');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
