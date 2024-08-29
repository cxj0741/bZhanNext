import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, redirectToSignIn } from '@clerk/nextjs/server';

// 创建一个路由匹配器，指定需要保护的路由
const isProtectedRoute = (req: NextRequest) => {
  const protectedRoutes = ['/dashboard', '/forum'];
  return protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));
};

export default authMiddleware({
  // 获取登录信息
  beforeAuth: (req: NextRequest) => {
    // 在身份验证之前执行其他中间件（例如，next-intl）
    return NextResponse.next();
  },

  // 根据登录信息进行处理
  afterAuth: async (auth, req: NextRequest) => {
    if (!auth.userId && isProtectedRoute(req)) {
      // 对于未登录的用户且访问受到保护的路径，重定向到登录页面
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId) {
      try {
        const response = await fetch(`${process.env.API_ADDRESS}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",  // 指定内容类型为 JSON
          },
          body: JSON.stringify({ userId: auth.userId }),  // 将数据序列化为 JSON 字符串
        });

        if (!response.ok) {
          console.error(`Failed to create or fetch user: ${response.statusText}`);
          // 返回一个错误响应，例如 500
          return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }

        const result = await response.json(); // 等待并解析 JSON 响应
        console.log("User data:", result);  // 可选：日志记录用户数据

      } catch (error) {
        console.error("Error creating or fetching user:", error);
        // 返回一个错误响应，例如 500
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
      }
    }

    // 允许访问公共路由或已处理的路由
    return NextResponse.next();
  },

  publicRoutes: ['/sign-in', '/sign-up'], // 设为公共的路由
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
