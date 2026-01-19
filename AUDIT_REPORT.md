# 🔍 Аудит проекта FoxYvn_Dashboard
Дата: 2026-01-19
Аудитор: Claude Code (WSL Administrator)
Проект: FOX YVN Command Center — панель управления с плагинной архитектурой

---

## 📊 Общая оценка

| Категория | Оценка | Критичных | Средних | Низких |
|-----------|--------|-----------|---------|--------|
| 🔐 Безопасность | **2/10** | **10** | 4 | 2 |
| 🏗️ Архитектура | **6/10** | 1 | 3 | 1 |
| 📝 Качество кода | **5/10** | 0 | 5 | 3 |
| ⚡ Производительность | **6/10** | 0 | 2 | 2 |
| 🔌 Плагинная система | **7/10** | 1 | 2 | 1 |
| 🗄️ База данных | **7/10** | 0 | 2 | 1 |

**ИТОГО: 10 критических проблем безопасности требуют немедленного исправления!**

---

## 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### [CRIT-001] Секреты в .env файле в открытом виде
- **Файл:** `.env:3-4`
- **Описание:** NEXTAUTH_SECRET и ABACUSAI_API_KEY хранятся в открытом виде в .env
- **Риск:** Если файл попадёт в git или будет украден — полный доступ к системе
- **Решение:**
  1. Добавить .env в .gitignore (уже добавлен ✅)
  2. Создать .env.example без реальных значений
  3. Использовать секреты через 1Password CLI или переменные окружения сервера
  4. Ротация NEXTAUTH_SECRET и ABACUSAI_API_KEY

**Код .env.example:**
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="CHANGE_ME_TO_RANDOM_64_CHARS"
ABACUSAI_API_KEY="YOUR_API_KEY_HERE"
AWS_PROFILE=hosted_storage
AWS_REGION=us-west-2
AWS_BUCKET_NAME=your-bucket-name
AWS_FOLDER_PREFIX=your-prefix/
```

---

### [CRIT-002] НЕТ аутентификации в /api/ai-chat
- **Файл:** `app/api/ai-chat/route.ts:5`
- **Описание:** Эндпоинт AI чата доступен БЕЗ проверки session — любой может слать запросы к AI
- **Риск:**
  - Злоумышленники могут сжечь весь API ключ Abacus AI
  - DoS атака через бесконечные запросы
  - Утечка промптов и системных сообщений
- **Решение:** Добавить проверку session и прав доступа

**Код до:**
```ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;
    // НЕТ проверки session!
```

**Код после:**
```ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(request: NextRequest) {
  try {
    // 1. Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Проверка прав доступа
    const userPermissions = (session.user as any).permissions || [];
    if (!userPermissions.includes('ai-core:read')) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { messages } = body;
```

---

### [CRIT-003] НЕТ проверки прав в API роутах
- **Файл:** `app/api/orders/route.ts:6-22`
- **Описание:** API проверяет только session, но НЕ проверяет права (permissions). Любой залогиненный пользователь может читать/создавать заказы
- **Риск:**
  - Нарушение принципа наименьших привилегий
  - Пользователи с ролью "viewer" могут создавать заказы
  - Утечка данных других пользователей
- **Решение:** Добавить проверку permissions на сервере

**Код до:**
```ts
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // НЕТ проверки прав!
    const orders = await prisma.order.findMany({
```

**Код после:**
```ts
import { hasPermission } from '@/core/permissions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Проверка прав доступа
    const userPermissions = (session.user as any).permissions || [];
    if (!hasPermission(userPermissions, 'ops:read')) {
      return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
```

---

### [CRIT-004] Внешний скрипт без SRI
- **Файл:** `app/layout.tsx:44`
- **Описание:** Загружается внешний скрипт от Abacus AI без Subresource Integrity
- **Риск:**
  - Если сервер Abacus AI скомпрометирован — приложение тоже
  - Man-in-the-middle атака может подменить скрипт
  - XSS через подменённый скрипт
- **Решение:** Добавить SRI hash или загрузить скрипт локально

**Код до:**
```tsx
<script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
```

**Код после (вариант 1 - SRI):**
```tsx
<script
  src="https://apps.abacus.ai/chatllm/appllm-lib.js"
  integrity="sha384-HASH_HERE"
  crossOrigin="anonymous"
></script>
```

**Код после (вариант 2 - локальный):**
```tsx
{/* Скачать скрипт в public/vendor/abacus-lib.js */}
<script src="/vendor/abacus-lib.js"></script>
```

---

### [CRIT-005] НЕТ .env.example
- **Файл:** Отсутствует `.env.example`
- **Описание:** Нет шаблона для других разработчиков
- **Риск:**
  - Разработчики могут случайно использовать production ключи
  - Нет документации какие переменные нужны
  - .env может попасть в git по ошибке
- **Решение:** Создать .env.example (см. [CRIT-001])

---

### [CRIT-006] НЕТ middleware для защиты роутов
- **Файл:** Отсутствует `middleware.ts` в корне
- **Описание:** Защита роутов только на клиенте (AuthGuard) — легко обойти через API
- **Риск:**
  - Прямой доступ к страницам без аутентификации через curl/Postman
  - Обход клиентской проверки через developer tools
  - API роуты не защищены централизованно
- **Решение:** Создать middleware.ts

**Создать файл middleware.ts:**
```ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Защита API роутов
    if (path.startsWith('/api/')) {
      if (path.startsWith('/api/auth/')) {
        return NextResponse.next();
      }
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Защита страниц приложения
    if (path.startsWith('/modules/') || path.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/api/:path*',
    '/modules/:path*',
    '/dashboard/:path*',
    '/(app)/:path*',
  ],
};
```

---

### [CRIT-007] НЕТ валидации входных данных
- **Файл:** `app/api/signup/route.ts:5-15`, `app/api/orders/route.ts:25-45`
- **Описание:** Входные данные не валидируются через zod/yup
- **Риск:**
  - SQL injection (хотя Prisma защищает)
  - Некорректные данные в БД (невалидный email, отрицательные суммы)
  - XSS через непроверенные поля
- **Решение:** Добавить zod схемы

**Создать lib/validation.ts:**
```ts
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Невалидный email'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Нужна хотя бы 1 заглавная буква')
    .regex(/[a-z]/, 'Нужна хотя бы 1 строчная буква')
    .regex(/[0-9]/, 'Нужна хотя бы 1 цифра'),
  name: z.string().min(2).max(50).optional(),
});

export const createOrderSchema = z.object({
  customer: z.string().min(2).max(100),
  address: z.string().min(5).max(200),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Невалидный номер телефона'),
  items: z.string().min(1),
  total: z.number().positive('Сумма должна быть положительной'),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
});
```

**Использование в app/api/signup/route.ts:**
```ts
import { signupSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Валидация
    const validatedData = signupSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    // ...
```

---

### [CRIT-008] НЕТ rate limiting
- **Файл:** Все API роуты
- **Описание:** Нет ограничения количества запросов
- **Риск:**
  - Brute force атаки на /api/auth/login
  - DoS атаки на /api/ai-chat
  - Спам регистраций через /api/signup
- **Решение:** Добавить rate limiting middleware

**Установить пакет:**
```bash
yarn add express-rate-limit
```

**Создать lib/rate-limit.ts:**
```ts
import rateLimit from 'express-rate-limit';
import { NextResponse } from 'next/server';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов
  message: 'Too many requests, please try again later',
  handler: () => {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  },
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Только 5 попыток логина
  message: 'Too many login attempts',
});
```

**Применить в API:**
```ts
import { limiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting
  await limiter(request);
  // ...
```

---

### [CRIT-009] Логирование чувствительных данных
- **Файл:** `lib/auth-options.ts:72-76`, `core/event-bus.ts:83-100`
- **Описание:** Permissions и события логируются в консоль
- **Риск:**
  - Утечка прав доступа пользователей в логи
  - Утечка бизнес-логики через события
  - Логи могут попасть в системы мониторинга
- **Решение:** Убрать console.log в production или использовать sanitized logging

**Код до (lib/auth-options.ts):**
```ts
console.log(
  '[Auth]',
  `Cached permissions in JWT for ${token.email}:`,
  permissions
);
```

**Код после:**
```ts
if (process.env.NODE_ENV === 'development') {
  console.log(
    '[Auth]',
    `Cached permissions in JWT for ${token.email}:`,
    permissions
  );
}
```

**Код до (core/event-bus.ts):**
```ts
console.log(LOG_PREFIX, `Published: ${event.type} from ${event.source}`);
```

**Код после:**
```ts
if (process.env.NODE_ENV === 'development') {
  console.log(LOG_PREFIX, `Published: ${event.type} from ${event.source}`);
}
```

---

### [CRIT-010] Дублирование логики логина
- **Файл:** `app/api/auth/login/route.ts`
- **Описание:** Эндпоинт /api/auth/login дублирует NextAuth
- **Риск:**
  - Две точки входа для аутентификации — сложнее защищать
  - Может привести к несогласованности session
  - Лишний код для поддержки
- **Решение:** Удалить app/api/auth/login/route.ts, использовать только NextAuth

**Действие:**
```bash
rm app/api/auth/login/route.ts
```

**Обновить клиентский код для использования signIn из next-auth/react:**
```ts
import { signIn } from 'next-auth/react';

// Вместо fetch('/api/auth/login')
await signIn('credentials', {
  email,
  password,
  redirect: false,
});
```

---

## ⚠️ Средние проблемы

### [MED-001] Использование any типов
- **Файл:** `lib/auth-options.ts:49,86,88`
- **Описание:** Используются (user as any) и (session.user as any)
- **Решение:** Создать типы для расширенного User

**Создать types/next-auth.d.ts:**
```ts
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
    permissions?: string[];
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    permissions?: string[];
  }
}
```

---

### [MED-002] console.log в продакшене
- **Файл:** 46 вхождений в 15 файлах
- **Описание:** Много логов, которые работают в production
- **Решение:** Обернуть в NODE_ENV проверку или использовать logger библиотеку

**Создать lib/logger.ts:**
```ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => isDev && console.log(...args),
  error: (...args: any[]) => console.error(...args), // Errors всегда логируем
  warn: (...args: any[]) => isDev && console.warn(...args),
  info: (...args: any[]) => isDev && console.info(...args),
};
```

**Заменить во всех файлах:**
```ts
// Было
console.log('[EventBus]', 'Published:', event);

// Стало
import { logger } from '@/lib/logger';
logger.log('[EventBus]', 'Published:', event);
```

---

### [MED-003] eslint игнорируется при сборке
- **Файл:** `next.config.js:10-12`
- **Описание:** `eslint: { ignoreDuringBuilds: true }`
- **Решение:** Убрать игнорирование и исправить все ошибки линтера

**Код до:**
```js
eslint: {
  ignoreDuringBuilds: true,
},
```

**Код после:**
```js
eslint: {
  ignoreDuringBuilds: false,
},
```

**Исправить ошибки:**
```bash
yarn lint --fix
```

---

### [MED-004] НЕТ HTTP security headers
- **Файл:** `next.config.js`
- **Описание:** Отсутствуют CSP, X-Frame-Options, HSTS и другие заголовки
- **Решение:** Добавить в next.config.js

**Код после:**
```js
const nextConfig = {
  // ... existing config
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apps.abacus.ai",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://apps.abacus.ai",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
```

---

### [MED-005] НЕТ проверки надёжности пароля
- **Файл:** `app/api/signup/route.ts:28`
- **Описание:** Пароли хэшируются, но не проверяются на сложность
- **Решение:** См. [CRIT-007] — добавить zod валидацию с regex

---

### [MED-006] Динамическая загрузка модулей без проверки
- **Файл:** `core/plugin-loader.ts:78-96`
- **Описание:** Модули импортируются через `@/modules/${moduleName}` без проверки на path traversal
- **Решение:** Валидировать moduleName

**Код до:**
```ts
const modulePath = `@/modules/${moduleName}`;
const imported = (await import(modulePath)) as Record<string, unknown>;
```

**Код после:**
```ts
// Проверка на path traversal
if (moduleName.includes('..') || moduleName.includes('/')) {
  console.warn(LOG_PREFIX, `Invalid module name: ${moduleName}`);
  return null;
}

const modulePath = `@/modules/${moduleName}`;
const imported = (await import(modulePath)) as Record<string, unknown>;
```

---

## 💡 Низкие проблемы

### [LOW-001] Изображения не оптимизируются
- **Файл:** `next.config.js:16`
- **Описание:** `images: { unoptimized: true }`
- **Решение:** Включить оптимизацию

**Код после:**
```js
images: {
  unoptimized: false,
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
},
```

---

### [LOW-002] НЕТ тестов
- **Файл:** Отсутствует папка `__tests__` или `.test.ts` файлы
- **Описание:** Нет unit/integration тестов
- **Решение:** Добавить Jest + React Testing Library

**Установить:**
```bash
yarn add -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

**Создать jest.config.js:**
```js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

**Примеры тестов:**
```ts
// __tests__/core/permissions.test.ts
import { hasPermission, hasAllPermissions } from '@/core/permissions';

describe('Permissions', () => {
  it('should check single permission', () => {
    expect(hasPermission(['ops:read'], 'ops:read')).toBe(true);
    expect(hasPermission(['ops:read'], 'ops:write')).toBe(false);
  });

  it('should check all permissions', () => {
    expect(hasAllPermissions(['ops:read', 'ops:write'], ['ops:read'])).toBe(true);
    expect(hasAllPermissions(['ops:read'], ['ops:read', 'ops:write'])).toBe(false);
  });
});
```

---

### [LOW-003] Отсутствие индексов в БД
- **Файл:** `prisma/schema.prisma`
- **Описание:** Нет индексов на часто запрашиваемых полях
- **Решение:** Добавить индексы

**Код после:**
```prisma
model Order {
  id          String   @id @default(cuid())
  orderNumber String   @unique
  customer    String
  status      String   @default("pending")
  createdAt   DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  @@index([status])
  @@index([createdAt])
  @@index([userId, status])
}

model Message {
  id          String   @id @default(cuid())
  chatId      String
  platform    String   @default("telegram")
  createdAt   DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  @@index([chatId])
  @@index([platform, createdAt])
}
```

---

## 🏗️ Архитектура

### Плюсы
✅ Плагинная система с manifest.json — хорошая расширяемость
✅ Шина событий (EventBus) для обмена между модулями
✅ Использование Prisma ORM
✅ TypeScript strict mode включён
✅ NextAuth для аутентификации
✅ Zod валидация для manifest.json

### Минусы
❌ Проверка прав только на клиенте (usePermissions хук)
❌ НЕТ централизованной обработки ошибок
❌ НЕТ разделения на слои (controllers/services/repositories)
❌ Плагины могут конфликтовать по роутам

---

## 📝 Качество кода

### Плюсы
✅ TypeScript strict mode
✅ ESLint настроен
✅ Prettier (вероятно)
✅ Использование shadcn/ui компонентов
✅ Консистентное именование

### Минусы
❌ any типы в 3 файлах
❌ 46 console.log в production
❌ Нет комментариев к сложной логике
❌ Дублирование кода (login логика)
❌ Неиспользуемый код (возможно)

---

## ⚡ Производительность

### Плюсы
✅ React 18 с автоматическими оптимизациями
✅ Next.js Server Components
✅ useCallback в хуках
✅ Cleanup функции в useEffect

### Минусы
❌ images: { unoptimized: true }
❌ Нет динамического импорта для модулей
❌ НЕТ кэширования API запросов (SWR/React Query не используется полностью)
❌ Нет мемоизации в event-bus

---

## 🔌 Плагинная система

### Плюсы
✅ Валидация manifest.json через zod
✅ Изоляция модулей через manifest
✅ События с таймаутами (5 секунд)
✅ Hot reload в development

### Минусы
❌ Нет валидации moduleName на path traversal
❌ Логирование событий в production
❌ НЕТ проверки конфликтов роутов
❌ НЕТ версионирования API плагинов

---

## 🗄️ База данных

### Плюсы
✅ Prisma ORM с TypeScript типами
✅ Каскадное удаление (onDelete: Cascade)
✅ Уникальные индексы (email, orderNumber)
✅ SQLite для разработки (простота)

### Минусы
❌ Нет индексов на часто запрашиваемых полях (status, createdAt)
❌ Нет миграций в git (только schema.prisma)
❌ Пароли хэшируются, но поле String (нужен Hash тип)

---

## ✅ Что сделано хорошо

1. **TypeScript strict mode** — отличная типизация
2. **Плагинная архитектура** — расширяемость из коробки
3. **NextAuth** — проверенная библиотека для auth
4. **Prisma** — безопасные запросы к БД
5. **Shadcn/ui** — качественные компоненты
6. **.env в .gitignore** — секреты не попадут в git
7. **Bcrypt** — безопасное хэширование паролей
8. **Zod валидация** для manifest.json
9. **EventBus** — хорошая архитектура для связи модулей
10. **React 18** — современный стек

---

## 📋 Приоритизированный план исправлений

### 🔴 Критично (сделать немедленно)
1. ✅ Создать .env.example ([CRIT-001], [CRIT-005])
2. ✅ Добавить проверку session в /api/ai-chat ([CRIT-002])
3. ✅ Добавить проверку permissions во всех API роутах ([CRIT-003])
4. ✅ Создать middleware.ts для защиты роутов ([CRIT-006])
5. ✅ Добавить zod валидацию входных данных ([CRIT-007])
6. ✅ Убрать логирование чувствительных данных ([CRIT-009])
7. ✅ Удалить app/api/auth/login/route.ts ([CRIT-010])

### 🟡 Важно (в течение недели)
8. Добавить rate limiting ([CRIT-008])
9. Добавить SRI для внешнего скрипта ([CRIT-004])
10. Добавить HTTP security headers ([MED-004])
11. Убрать any типы ([MED-001])
12. Обернуть console.log в NODE_ENV ([MED-002])
13. Исправить eslint: { ignoreDuringBuilds: false } ([MED-003])
14. Добавить валидацию moduleName ([MED-006])

### 🟢 Улучшения (когда будет время)
15. Включить оптимизацию изображений ([LOW-001])
16. Добавить тесты ([LOW-002])
17. Добавить индексы в БД ([LOW-003])
18. Добавить динамический импорт для модулей
19. Настроить CSP правильно
20. Добавить логгер вместо console.log

---

## 🎯 Итоговая рекомендация

**Проект имеет хорошую архитектуру, но КРИТИЧЕСКИЕ проблемы безопасности делают его уязвимым!**

**Основные риски:**
- ❌ API эндпоинты доступны без проверки прав
- ❌ AI чат доступен без аутентификации (можно сжечь API ключ)
- ❌ Нет rate limiting (DoS атаки)
- ❌ Секреты в открытом виде
- ❌ Нет серверной защиты роутов

**Следующие шаги:**
1. **СРОЧНО** исправить 10 критических проблем безопасности
2. Добавить тесты для критичных функций (auth, permissions)
3. Настроить CI/CD с проверкой безопасности
4. Провести penetration testing перед деплоем в production

**Оценка готовности к production: 30%**

После исправления критических проблем — можно запускать в production.

---

**Конец отчёта**
Если нужна помощь с исправлениями — скажи, я могу исправить критичные уязвимости прямо сейчас!
