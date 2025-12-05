console.log("Seni seviyorum Rabia!"); // deploy edince loglarda gözükecek

const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Merhaba Ferhat! Node container çalışıyor.\nSeni seviyorum Rabia!\n');
  } else if (req.url === '/api') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'API endpoint çalışıyor ve güncel!' }));
  } else if (req.url === '/hello') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello Ferhat!');
  } else if (req.url === '/goodbye') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Goodbye Ferhat!');
  } else {
    res.statusCode = 404;
    res.end('Sayfa bulunamadı.');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
