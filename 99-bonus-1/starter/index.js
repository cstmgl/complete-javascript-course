const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
  
  const parsedReq = url.parse(req.url, true);
  const pathName = parsedReq.pathname;
  const queryParams = parsedReq.query;
  const queryId = queryParams.id;

  if (pathName === '/products' || pathName === '/') {
    res.writeHead(200, {'Content-type': 'text/html'});

    res.end(`This is the products page\n`);
  }
  else if (pathName === '/laptop' && queryId && queryId >=0 && queryId < laptopData.length) {

    fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
      const laptop = laptopData[queryId];
      let output = data.replace(/{%PRICE%}/g, laptop.price);
      output = output.replace(/{%IMAGE%}/g, laptop.image);// @todo fix image
      output = output.replace(/{%PRODUCTNAME%}/g, laptop.productName);
      output = output.replace(/{%SCREEN%}/g, laptop.screen);
      output = output.replace(/{%CPU%}/g, laptop.cpu);
      output = output.replace(/{%STORAGE%}/g, laptop.storage);
      output = output.replace(/{%RAM%}/g, laptop.ram);
      output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
      res.writeHead(200, {'Content-type': 'text/html'});
      res.end(output);
      });
  } else {
    res.writeHead(404, {'Content-type': 'text/html'});
    res.end('Not found\n');
  }
});

// server.listen(1337, '127.0.0.1', () => {
//     console.log('Listiening for requests now');
// });

server.listen(1337, '127.0.0.1');