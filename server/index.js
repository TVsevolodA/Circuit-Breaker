const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001

const NUMBER_STATUSES = 2;
const information = ['Операция выполнена успешно', 'Произошла непредвиденная ошибка. Повторите позже.'];

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.listen(port, () => {
console.log(`Server running on port ${port}.`)
});

app.get('/', (request, response) => {
    response.json({ info: 'Корневой каталог сервера' })
});

app.get('/transfer', (request, response) => {
  const code = Math.floor(Math.random() * NUMBER_STATUSES);
  const statusCode = code === 0 ? 200 : 500;
  response.status(statusCode).json({ info: information[code] });
});