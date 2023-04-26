const queries = require('./queries')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.listen(port, () => {
    console.log(`Client running on port ${port}.`)
});

app.get('/', (request, response) => {
    response.json({ info: 'Корневой каталог клиента' })
});

app.get('/status', queries.getStatus);
