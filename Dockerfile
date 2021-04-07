FROM node:14-alpine

EXPOSE 9000 9001

WORKDIR /app

CMD ["npm", "run", "dev"]
