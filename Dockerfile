FROM node:24.3.0
WORKDIR /app
COPY . /app
RUN npm install