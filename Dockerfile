FROM node:12-alpine

EXPOSE 9000 9001

WORKDIR /app

CMD ["npm", "run", "dev"]
