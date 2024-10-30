import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 外部API用のパスチェック
  if (request.nextUrl.pathname.startsWith('/external-api/')) {
    const apiKey = request.headers.get('x-api-key')

    if (!apiKey || apiKey !== process.env.EXTERNAL_API_KEY) {
      return new NextResponse('Invalid API Key', {
        status: 401,
      })
    }
    return NextResponse.next()
  }

  // その他すべてのパスに対してBasic認証を適用
  const basicAuth = request.headers.get('authorization')
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: [
    /*
     * /external-api/で始まるパスと、それ以外のすべてのパスにマッチ
     * ただし、_next/static, _next/image, favicon.ico は除外
     */
    '/external-api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 