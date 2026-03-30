import { NestFactory } from '@nestjs/core';
import * as argon2 from 'argon2';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  const prisma = app.get(PrismaService);

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  // ADMIN
  const adminHash = await argon2.hash(adminPassword);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      username: 'admin',
      password: adminHash,
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      username: 'admin',
      password: adminHash,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin ready:', adminUser.email);

  // DEMO USER
  const demoEmail = 'demo@demo.com';
  const demoPassword = '123456';
  const demoHash = await argon2.hash(demoPassword);

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      username: 'DemoUser',
      password: demoHash,
      recoin_balance: 1000,
    },
    create: {
      email: demoEmail,
      username: 'DemoUser',
      password: demoHash,
      recoin_balance: 1000,
    },
  });

  console.log('✅ Demo user ready:', demoUser.email);
  //TELEFON
  const existingPhone = await prisma.product.findFirst({
    where: {
      title: 'Demo iPhone 11',
    },
  });

  if (!existingPhone) {
    await prisma.product.create({
      data: {
        title: 'iPhone 11',
        description: 'Ez egy minta hirdetés, amit azonnal megvehetsz.',
        condition: 'Használt',
        category: 'Telefon',
        brand: 'Apple',
        model: 'iPhone 11',
        price_recoin: 200,
        image_url: '/uploads/products/minta.telefon.jpg',
        seller_id: demoUser.id,
        status: 'AVAILABLE',
      },
    });

    console.log('Demo mobile created');
  } else {
    console.log('Demo product mobile already exists');
  }
  //LAPTOP
  const existingLaptop = await prisma.product.findFirst({
    where: {
      title: 'Demo Laptop Dell Inspiron',
    },
  });

  if (!existingLaptop) {
    await prisma.product.create({
      data: {
        title: 'Laptop Dell Inspiron',
        description: 'Megkímélt állapotú laptop, tökéletes tanulásra és munkára.',
        condition: 'Új',
        category: 'Laptop',
        brand: 'Dell',
        model: 'Inspiron 15',
        price_recoin: 400,
        image_url: '/uploads/products/minta.laptop.jpg',
        seller_id: demoUser.id,
        status: 'AVAILABLE',
      },
    });

    console.log('Demo laptop created');
  } else {
    console.log('Demo laptop already exists');
  }
  //EGER
  const existingMouse = await prisma.product.findFirst({
    where: {
      title: 'Demo Mouse Razer Viper',
    },
  });

  if (!existingMouse) {
    await prisma.product.create({
      data: {
        title: 'Mouse Razer Viper',
        description: 'Megkímélt állapotú egér, tökéletes játékra és munkára.',
        condition: 'Újszerű',
        category: 'Egér',
        brand: 'Razer',
        model: 'Razer Viper',
        price_recoin: 150,
        image_url: '/uploads/products/minta.eger.jpg',
        seller_id: demoUser.id,
        status: 'AVAILABLE',
      },
    });

    console.log('Demo mouse created');
  } else {
    console.log('Demo mouse already exists');
  }
  await app.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});