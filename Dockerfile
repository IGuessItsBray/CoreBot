# docker build . -t iguessitsbray/corebot
# docker push iguessitsbray/corebot:latest

FROM        node:lts-alpine
WORKDIR     /app

RUN         apk add --no-cache git

COPY        package.json package-lock.json ./
RUN         npm ci
COPY        . .

CMD         node index.js
