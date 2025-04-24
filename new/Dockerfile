# docker build . -t sethwv/utili2
# docker push sethwv/utili2:latest

FROM        node:lts-alpine
WORKDIR     /app

LABEL org.opencontainers.image.source="https://github.com/sethwv/nexus"
LABEL org.opencontainers.image.description="Nexus Discord Bot"
LABEL org.opencontainers.image.licenses="Apache-2.0"

RUN         apk add --no-cache git

COPY        package.json yarn.lock ./
RUN         yarn --frozen-lockfile
COPY        . .

CMD         yarn shard