export default () => ({
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URI,
  AWS: {
    PRIVATE_KEY: process.env.AWS_PRIVATE_KEY,
    CDN: process.env.AWS_CDN,
    ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  },
  S3: {
    BUCKET: process.env.S3_BUCKET,
    REGION: process.env.S3_REGION,
  },
  PAYMENT: {
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_ENDPOINT_SECRET: process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET,
  },
  MAIL: {
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_FROM: process.env.MAIL_FROM,
  },
  API_AI_AVATAR: process.env.API_AI_AVATAR,
  API_SERVER: process.env.API_SERVER,
});
