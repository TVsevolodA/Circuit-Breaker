const http = require('http');

let currentStatusServer = 'Closed';

const FAILURE_COUNTER = 5;  // Допустимое количество запросов на сервер в режиме Half-Open.
let timer = false;          // Состояние активности таймера. false - отключен, true -включен.
let counter = 0;
let messageServer = {
    statusCode: '',
    message: '',
};

function sendRequest (path, method, response) {

    return new Promise((resolve, reject) => {
        const options =
        {
            hostname: 'server',
            port: 3001,
            path: path,
            method: method
        }

        const req = http.request(options, (res) => {
            let responseServer = {
                statusCode: res.statusCode,
                message: '',
            };
            res.on('data', (d) => {
                const status = JSON.parse(d);
                responseServer.message = status.info;
            });
            res.on('end', () => {
                resolve(responseServer);
              });
        });
        req.on('error', (error) => {
            reject(error);
        });
        req.end();
    });
}

const getStatus = (request, response) => {
    
    if (currentStatusServer != 'Open') {
        if (currentStatusServer === 'Closed') {
            sendRequest('/transfer', 'GET', response)
            .then((responseServer) => {
                if (responseServer.statusCode == 500) transitionOpenState();
                messageServer.statusCode = responseServer.statusCode;
                messageServer.message = responseServer.message;
                response.status(responseServer.statusCode).json(responseServer.message);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
        }
        else if (currentStatusServer === 'Half-Open') {
            sendRequest('/transfer', 'GET', response)
            .then((responseServer) => {
                if (counter < FAILURE_COUNTER) {
                    if (responseServer.statusCode == 500)
                    {
                        counter = 0;
                        transitionOpenState();
                    }
                    else counter++;
                }
                else {
                    currentStatusServer = 'Closed';
                    counter = 0;
                }
                messageServer.statusCode = responseServer.statusCode;
                messageServer.message = responseServer.message;
                response.status(responseServer.statusCode).json(responseServer.message);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
        }
    }
    else {
        if(timer) response.status(messageServer.statusCode).json(messageServer.message);
        else {
            sendRequest('/transfer', 'GET', response)
            .then((responseServer) => {
                if (responseServer.statusCode == 500) transitionOpenState();
                else currentStatusServer = 'Closed';
                messageServer.statusCode = responseServer.statusCode;
                messageServer.message = responseServer.message;
                response.status(responseServer.statusCode).json(responseServer.message);
            })
            .catch((error) => {
                response.status(500).json(error);
            });
        }
    }
}

function transitionOpenState () {
    currentStatusServer = 'Open';
    timer = true;
    setTimeout(
    () => {
        currentStatusServer = 'Half-Open';
        timer = false;
    },
    2000
    );
}

module.exports = {
    getStatus,
}