FROM node:24.3.0
WORKDIR /run-dir
ENV PW_TEST_HTML_REPORT_OPEN='never'

RUN git clone https://github.com/oliverrochester/home-test.git /run-dir

RUN cd /run-dir

RUN npm install

RUN apt-get update

RUN npx playwright install --with-deps


RUN npx playwright test

