import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Невалидный email'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Нужна заглавная буква')
    .regex(/[a-z]/, 'Нужна строчная буква')
    .regex(/[0-9]/, 'Нужна цифра'),
  name: z.string().min(2).max(50).optional(),
});

export const createOrderSchema = z.object({
  customer: z.string().min(2).max(100),
  address: z.string().min(5).max(200),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  items: z.string().min(1),
  total: z.number().positive(),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
});

export const messageSchema = z.object({
  chatId: z.string().min(1),
  content: z.string().min(1).max(4000),
  platform: z.enum(['telegram', 'whatsapp', 'internal']).default('internal'),
});
