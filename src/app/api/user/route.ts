import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

// 使用全局 prisma 变量来防止在开发环境中创建多个 PrismaClient 实例
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

interface UserRequest {
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = (await request.json()) as UserRequest;

    if (!userId) {
      return NextResponse.json(
        { message: "Bad Request: userId is required" },
        { status: 400 }
      );
    }

    // 查询用户
    let user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    // 如果用户不存在，创建一个新的用户
    if (!user) {
      user = await prisma.user.create({
        data: {
          userId: userId,
          // 在此处添加其他需要的用户数据字段，例如：name, email 等
        },
      });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Internal Error" },
      { status: 500 }
    );
  }
}
