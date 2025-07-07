
FROM node:24.3.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install playwright

COPY . .

ENV PORT=3200

EXPOSE 3200

CMD ["npm", "test"]

