FROM node:20-slim
WORKDIR /app
# Clean slate for native module bindings
RUN rm -rf node_modules package-lock.json
COPY package*.json .
RUN npm install --build-from-source
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
