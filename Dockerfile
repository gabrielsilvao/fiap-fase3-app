# FROM node:18 as base
# WORKDIR /usr/src/fiap-fase3-app
# COPY ./package.json .
# COPY prisma ./prisma/
# RUN npm i && npm i -g typescript

# FROM base as build
# WORKDIR /usr/src/fiap-fase3-app
# COPY . .
# COPY --from=base /usr/src/fiap-fase3-app/node_modules ./node_modules
# COPY --from=base /usr/src/fiap-fase3-app/prisma ./prisma
# RUN tsc

# FROM base as prod
# WORKDIR /usr/src/fiap-fase3-app
# COPY --from=build /usr/src/fiap-fase3-app/dist ./dist
# COPY --from=build /usr/src/fiap-fase3-app/prisma ./prisma
# ENV DATABASE_URL=mysql://root:root@db:3306/fiap_db
# CMD ["node", "dist/main/server.js"]

FROM node:18
WORKDIR /usr/src/fiap-fase3-app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
RUN npx prisma generate
ENV DATABASE_URL=mysql://root:root@db:3306/fiap_db
RUN chmod +x ./start.sh
# CMD ["node", "dist/main/server.js"]
CMD ["./start.sh"]