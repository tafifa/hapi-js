FROM node:18-slim
WORKDIR /app
ENV HOST 0.0.0.0
COPY . .
RUN npm install -g npm@latest && npm install --omit=dev
EXPOSE 8080
CMD [ "npm", "run", "start"]