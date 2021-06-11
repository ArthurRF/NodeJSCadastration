FROM node


WORKDIR /Users/55479/Desktop/Dev

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm","run","dev"]