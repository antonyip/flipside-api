FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["website", "/app"]
RUN npm install --omit=dev
COPY ["./sdk-package-patch.json", "/app/node_modules/@flipsidecrypto/sdk/package.json"]
CMD [ "node", "index.js" ]