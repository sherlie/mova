FROM node:12-alpine

EXPOSE 3000
EXPOSE 56800

WORKDIR /app

CMD ["node", "dist/index.js"]
