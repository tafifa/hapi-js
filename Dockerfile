FROM node:18-slim
WORKDIR /app
ENV PORT 8080
COPY . .
RUN npm install --only=production
EXPOSE 8080
CMD [ "node", "app.js" ]