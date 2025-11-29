    # ----------- Stage 1: Build -----------
    FROM node:22-alpine AS builder

    # Set working directory
    WORKDIR /app

    # Copy package files first to leverage Docker cache
    COPY package*.json ./

    # Install all dependencies (including devDependencies)
    RUN npm install

    # Copy the rest of the project files
    COPY . .

    # Generate Prisma scheme
    RUN npx prisma generate

    # Build the app
    RUN npm run build



    # ----------- Stage 2: Production -----------
    FROM node:22-alpine AS production

    # Set working directory
    WORKDIR /app

    # Copy only the necessary files for production
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/package-lock.json ./
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/prisma ./prisma

    # Copy static files
    # COPY --from=builder /app/public ./public

    # Installation of only production depending
    RUN npm install --production

    # Installation of a variable environment
    ENV NODE_ENV=production

    COPY docker/dev/entrypoint.sh /entrypoint.sh
    RUN chmod +x /entrypoint.sh

    ENTRYPOINT ["/entrypoint.sh"]



