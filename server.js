if (req.url === '/') {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Merhaba Ferhat! Node container çalışıyor.\n');
} else if (req.url === '/api') {   // buradaki parantez şart
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'API endpoint çalışıyor!' }));
} else {
  res.statusCode = 404;
  res.end('Sayfa bulunamadı.');
}
