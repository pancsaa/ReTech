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

  // 🔐 ADMIN
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hash = await argon2.hash(adminPassword);

    await prisma.user.create({
      data: {
        email: adminEmail,
        username: 'admin',
        password: hash,
        role: 'ADMIN',
        recoin_balance: 1000,
      },
    });

    console.log('✅ Admin created:', adminEmail);
  } else {
    console.log('ℹ️ Admin already exists:', adminEmail);
  }

  // 👤 DEMO USER
  const demoEmail = 'demo@demo.com';

  let demoUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!demoUser) {
    const hash = await argon2.hash('123456');

    demoUser = await prisma.user.create({
      data: {
        email: demoEmail,
        username: 'DemoUser',
        password: hash,
        recoin_balance: 1000,
      },
    });

    console.log('✅ Demo user created');
  }

  // 📦 DEMO PRODUCT (csak ha nincs még)
  const existingProduct = await prisma.product.findFirst({
    where: {
      title: 'iPhone 11',
    },
  });

  if (!existingProduct) {
    await prisma.product.create({
      data: {
        title: 'Demo iPhone 11',
        description: 'Ez egy minta hirdetés, amit azonnal megvehetsz.',
        condition: 'Használt',
        category: 'Telefon',
        brand: 'Apple',
        model: 'iPhone 11',
        price_recoin: 200,
        image_url: '/uploads/products/minta.telefon.jpg',
        seller_id: demoUser!.id,
        status: 'AVAILABLE',
      },
    });

    console.log('✅ Demo product mobile');
  } else {
    console.log('ℹ️ Demo product mobile already exists');
  }

  const existingLaptop = await prisma.product.findFirst({
  where: {
    title: 'Demo Laptop Dell Inspiron',
  },
});

if (!existingLaptop) {
  await prisma.product.create({
    data: {
      title: 'Demo Laptop Dell Inspiron',
      description: 'Megkímélt állapotú laptop, tökéletes tanulásra és munkára.',
      condition: 'Új',
      category: 'Laptop',
      brand: 'Dell',
      model: 'Inspiron 15',
      price_recoin: 500,
      image_url: '/uploads/products/minta.laptop.jpg',
      seller_id: demoUser!.id,
      status: 'AVAILABLE',
    },
  });

  console.log('💻 Demo laptop created');
} else {
  console.log('ℹ️ Demo laptop already exists');
}

  await app.close();
}


main().catch((e) => {
  console.error(e);
  process.exit(1);
});