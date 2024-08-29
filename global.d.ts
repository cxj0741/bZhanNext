import { PrismaClient } from '@prisma/client';

// 让 TypeScript 识别 globalThis 上的 prisma 属性
declare global {
  var prisma: PrismaClient | undefined;
}

// 这行代码是必要的，让文件成为一个模块文件，而不是全局文件
export {};
