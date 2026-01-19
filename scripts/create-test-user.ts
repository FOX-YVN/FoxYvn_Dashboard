// Скрипт для создания тестового пользователя
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@test.com';
  const password = 'password123';
  const name = 'Test User';

  // Проверяем существует ли пользователь
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('✅ Пользователь уже существует:', email);
    console.log('Данные для входа:');
    console.log('  Email:', email);
    console.log('  Password: password123');
    return;
  }

  // Хэшируем пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // Создаём пользователя
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'operator',
    },
  });

  console.log('✅ Тестовый пользователь создан успешно!');
  console.log('');
  console.log('Данные для входа:');
  console.log('  Email:', email);
  console.log('  Password: password123');
  console.log('');
  console.log('Открой http://localhost:3000/login и войди с этими данными');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
