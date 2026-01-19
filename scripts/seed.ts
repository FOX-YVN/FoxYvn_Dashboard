import { prisma } from '../lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // Create test user
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'admin',
    },
  });

  console.log('Created user:', user.email);

  // Create some sample orders
  const orders = [
    { orderNumber: 'YVN-001', customer: 'Александр Петров', address: 'ул. Абовяна, 12', phone: '+374 91 234567', items: '2x Пицца, 1x Кола', total: 4500, status: 'pending', priority: 'high' },
    { orderNumber: 'YVN-002', customer: 'Мария Иванова', address: 'пр. Маштоца, 45', phone: '+374 93 456789', items: '1x Бургер, 1x Фри', total: 2800, status: 'processing', priority: 'normal', courier: 'Артур' },
    { orderNumber: 'YVN-003', customer: 'Давид Григорян', address: 'ул. Туманяна, 8', phone: '+374 99 876543', items: '3x Суши сет', total: 12000, status: 'delivering', priority: 'normal', courier: 'Гагик' },
  ];

  for (const order of orders) {
    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: {},
      create: {
        ...order,
        userId: user.id,
      },
    });
  }

  console.log('Created sample orders');

  // Create sample documents
  // tags должен быть строкой (JSON), а не массивом
  const documents = [
    { title: 'Руководство курьера', content: 'Полное руководство для новых курьеров.', category: 'guides', tags: 'курьер,обучение' },
    { title: 'Регламент работы', content: 'Расписание и правила работы офиса.', category: 'operations', tags: 'офис,регламент' },
  ];

  for (const doc of documents) {
    await prisma.document.create({
      data: {
        ...doc,
        userId: user.id,
      },
    });
  }

  console.log('Created sample documents');
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
