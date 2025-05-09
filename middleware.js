import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Rate limit settings
const RATE_LIMIT = 400; // Maximum allowed requests
const RATE_LIMIT_WINDOW = 60 * 1000; // Time window in milliseconds (1 minute)
const requests = new Map();

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDevelopment = process.env.NODE_ENV === "development";

  // Get client's IP address
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] || // Gets real IP if behind a proxy
    req.ip ||
    "unknown";
  // Implement rate limiting
  const currentTime = Date.now();
  const requestLog = requests.get(ip) || [];

  // Filter requests within the current time window
  const updatedRequestLog = requestLog.filter(
    (timestamp) => currentTime - timestamp < RATE_LIMIT_WINDOW
  );

  if (updatedRequestLog.length >= RATE_LIMIT) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // Store the updated request log
  updatedRequestLog.push(currentTime);
  requests.set(ip, updatedRequestLog);

  if (pathname.startsWith("/api/wompi/webhook")) {
    return NextResponse.next();
  }

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https://connect.facebook.net/ https://mon.tiktokv.com https://*.tiktok.com https://s3.amazonaws.com https://www.googletagmanager.com https://checkout.wompi.co https://papeleriaelrio.com.co https://pinateriaelrio.com https://rya85q-u0.myshopify.com https://noir-perfumeria.myshopify.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://cdn.ipregistry.co https://s3.amazonaws.com https://mon.tiktokv.com https://*.tiktok.com https://connect.facebook.net/ https://res.cloudinary.com https://randomuser.me https://images.unsplash.com https://lh3.googleusercontent.com https://www.googletagmanager.com  https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://www.google.com.co https://www.freeiconspng.com https://www.pngmart.com https://cdn.shopify.com https://cdn.shopifycdn.com https://cdn.shopifycdn.net https://papeleriaelrio.com.co https://pinateriaelrio.com https://rya85q-u0.myshopify.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://checkout.wompi.co https://connect.facebook.net/ https://mon.tiktokv.com https://*.tiktok.com;
    frame-ancestors 'none';
    upgrade-insecure-requests; 
    connect-src 'self' https://www.somoselhueco.com https://mon.tiktokv.com https://*.tiktok.com https://s3.amazonaws.com blob: ws: http://localhost:3000 https://connect.facebook.net/ https://amaua.myshopify.com https://noir-perfumeria.myshopify.com https://aleko-comercializadora.myshopify.com https://papeleriaelrio.com.co https://los-victorinos.myshopify.com https://pinateriaelrio.com https://rya85q-u0.myshopify.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com;
  `;

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), accelerometer=(), gyroscope=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Expect-CT", "max-age=86400, enforce");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set(
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups"
  );
  // response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://somoselhueco.com"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  const session = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // if (pathname == "/checkout") {
  //   if (!session) return NextResponse.redirect(`${origin}`);
  // }
  // if (pathname.startsWith("/order")) {
  //   if (!session) return NextResponse.redirect(`${origin}`);
  // }
  if (pathname.startsWith("/myprofile")) {
    if (!session) return NextResponse.redirect(`${origin}`);
  }
  if (pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(`${origin}`);
    if (session.role !== "admin") return NextResponse.redirect(`${origin}`);
  }
  if (pathname.startsWith("/business")) {
    if (!session) return NextResponse.redirect(`${origin}`);
    if (session.role !== "business") return NextResponse.redirect(`${origin}`);
  }
  if (pathname.startsWith("/messenger")) {
    if (!session) return NextResponse.redirect(`${origin}`);
    if (session.role !== "messenger") return NextResponse.redirect(`${origin}`);
  }

  return response;
}
