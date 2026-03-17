git clone --link--
cd ReTech/
git switch panna

hozz létre egy .env fájlt a "backend" mappán belül:
    DATABASE_URL="mysql://root:123@localhost:3307/retech_db"
    PORT=3000
    JWT_SECRET: node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
    JWT_EXPIRES_IN="1h"

cd backend/
1.npm i
(ha nincs létrehozva akkor hozz létre egy mysql mappát)
(ha még nem futtatad egyszer sem a mysql mappán belül akkor: 
    docker run -d --name ReTech -p 3307:3306 -e MYSQL_ROOT_PASSWORD=123 -e MYSQL_DATABASE=retech_db mysql:8.4)
2.npx prisma generate
3.npx prisma migrate dev --name init
4.npx tsx scripts/seed-admin.ts
5.npx prisma studio
6.npm run start:dev