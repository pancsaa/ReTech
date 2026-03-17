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
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  const hash = await argon2.hash(adminPassword);

  if (existing) {
    console.log('Admin already exists:', adminEmail);
    await app.close();
    return;
  }

  await prisma.user.create({
    data: {
      email: adminEmail,
      username: 'admin',
      password: hash,
      role: 'ADMIN', 
    },
  });
  console.log('Admin created:', adminEmail);
  await app.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});