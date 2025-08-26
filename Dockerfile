# Використовуємо Node.js LTS
FROM node:20-alpine

# Робоча директорія
WORKDIR /usr/src/app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код
COPY . .

# Збираємо TypeScript у JavaScript
RUN npm run build

# Відкриваємо порт 3000
EXPOSE 3000

# Запускаємо у продакшн режимі
CMD ["node", "dist/main.js"]
