Трифонов В.
б1 ИФСТ-31

Для запуска проекта необходимо иметь 3 образа:
1) nodejs
2) client
3) server

Чтобы запустить введите в терминале команду: docker-compose up d
После запуска перейдите на адрес localhost:3000/status.

Данный проект - это реализация шаблона Circuit Breaker на node js. Circuit Breaker - это шаблон обработки отказов сервиса, при котором сервер не всегда может обработать запрос клиента.
Более подробную информацию можете получить здесь: https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker.
