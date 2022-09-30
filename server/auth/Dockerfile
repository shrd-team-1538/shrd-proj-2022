FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
CMD ["./wait-for-it.sh", "db:3306", "--", "node", "index"]