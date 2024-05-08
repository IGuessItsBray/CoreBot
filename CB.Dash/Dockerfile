FROM        node:lts-alpine
WORKDIR     /app

EXPOSE      3000
ENV         REACT_APP_API_URL=http://localhost:3000/api/
ENV         REACT_APP_CLIENT_ID=961235596557316156

RUN         apk add --no-cache git
COPY        . .
RUN         yarn --frozen-lockfile

CMD         sh ./start.sh