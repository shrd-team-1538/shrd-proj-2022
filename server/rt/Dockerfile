FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
CMD ["./wait-for-it.sh", "db_api:40000", "--", "node", "index"]