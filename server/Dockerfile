FROM node

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "node", "index.js" ]