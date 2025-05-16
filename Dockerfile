FROM node:18-slim

WORKDIR /app

COPY frontend/package*.json ./frontend/

WORKDIR /app/frontend

RUN npm install
RUN npm install -g @angular/cli

COPY frontend/ /app/frontend/

WORKDIR /app/frontend

EXPOSE 80

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "80", "--proxy-config", "proxy.conf.json"]
