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

  const templateCard = `<figure class="card">
  <div class="card__hero">
      <img src="##_IMAGE_##" alt="##_PRODUCTNAME_##" class="card__img">
  </div>
  <h2 class="card__name">##_PRODUCTNAME_##</h2>
  <p class="card__detail"><span class="emoji-left">🖥</span> ##_SCREEN_##</p>
  <p class="card__detail"><span class="emoji-left">🧮</span> ##_CPU_##</p>
  <div class="card__footer">
      <p class="card__price">$##_PRICE_##</p>
      <a href="/laptop?id=##_ID_##" class="card__link">Check it out <span class="emoji-right">👉</span></a>
  </div>
</figure>`;

  // PRODUCT OVERVIEW
  if (pathName === '/products' || pathName === '/') {
    fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
      const cardsOuput = laptopData.map(el => replaceTemplate(templateCard, el)).join('');

      let output = data.replace(/##_CARDS_##/g, cardsOuput);

      res.writeHead(200, {'Content-type': 'text/html'});
      res.end(output);
    });
  }

  // LAPTOP DETAIL
  else if (pathName === '/laptop' && queryId && queryId >=0 && queryId < laptopData.length) {

    fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
      const laptop = laptopData[queryId];
      const output = replaceTemplate(data, laptop);
      res.writeHead(200, {'Content-type': 'text/html'});
      res.end(output);
      });
  } 
  
  // IMAGES
  else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, {'Content-type': 'image/jpg'});
      res.end(data);
      });
  } 


  // NOT FOUND
  else {
    res.writeHead(404, {'Content-type': 'text/html'});
    res.end('Not found\n');
  }
});

// server.listen(1337, '127.0.0.1', () => {
//     console.log('Listiening for requests now');
// });

server.listen(1337, '127.0.0.1');

function replaceTemplate(origin, laptop) {
  let output = origin.replace(/##_PRICE_##/g, laptop.price);
  output = output.replace(/##_IMAGE_##/g, laptop.image);// @todo fix image
  output = output.replace(/##_PRODUCTNAME_##/g, laptop.productName);
  output = output.replace(/##_SCREEN_##/g, laptop.screen);
  output = output.replace(/##_CPU_##/g, laptop.cpu);
  output = output.replace(/##_STORAGE_##/g, laptop.storage);
  output = output.replace(/##_RAM_##/g, laptop.ram);
  output = output.replace(/##_DESCRIPTION_##/g, laptop.description);
  output = output.replace(/##_ID_##/g, laptop.id);

  return output;
};