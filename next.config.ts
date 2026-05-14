import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ufs.sh" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://mp-checkout-sandbox.mercadopago.com https://mp-checkout.mercadopago.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://utfs.io https://ufs.sh https://images.unsplash.com https://*.stripe.com https://lh3.googleusercontent.com",
              "font-src 'self'",
              "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://uploadthing.com https://utfs.io https://viacep.com.br https://api.mercadopago.com",
              "frame-src https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com https://mp-checkout-sandbox.mercadopago.com https://mp-checkout.mercadopago.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
