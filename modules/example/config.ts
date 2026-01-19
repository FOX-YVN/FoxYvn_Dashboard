import { z } from 'zod';

// Схема конфигурации примерного модуля
export const exampleConfigSchema = z.object({
  greeting: z.string().default('Привет'),
});

export type ExampleConfig = z.infer<typeof exampleConfigSchema>;
