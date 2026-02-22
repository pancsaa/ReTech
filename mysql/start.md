git clone --link--
cd ReTech/
git switch panna

hozz létre egy .env fájlt a "backend" mappán belül:
    DATABASE_URL="mysql://root:123@localhost:3307/retech_db"
    PORT=3000
    JWT_SECRET: openssl rand -base64 64
    JWT_EXPIRES_IN="1h"

cd backend/
npm i
(ha nincs létrehozva akkor hozz létre egy mysql mappát)
(ha még nem futtatad egyszer sem a mysql mappán belül akkor: 
    docker run -d --name mydb -p 3307:3306 -e MYSQL_ROOT_PASSWORD=123 -e MYSQL_DATABASE=product_db mysql:8.4)
npx prisma generate
(npx prisma migrate dev --name init)
npx prisma studio



npm run start:dev