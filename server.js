const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const store = {}; // basit memory storage

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Merhaba Ferhat! Node container çalışıyor.\n');
    
  } else if (req.url === '/api') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'API endpoint çalışıyor!' }));
    
  } else if (req.url === '/status') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok', time: new Date() }));
    
  } else if (req.url.startsWith('/set/')) {
    const [_, key, value] = req.url.split('/');
    store[key] = value;
    res.statusCode = 200;
    res.end(`Set ${key} = ${value}`);
    
  } else if (req.url.startsWith('/get/')) {
    const [_, key] = req.url.split('/');
    res.statusCode = 200;
    res.end(store[key] || 'Not found');
    
  } else {
    res.statusCode = 404;
    res.end('Sayfa bulunamadı.');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
