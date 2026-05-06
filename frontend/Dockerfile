FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# O Vite roda por padrão na 5173
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]