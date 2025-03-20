const config = {
  serverPort: process.env.PORT || 5000,
  dbUser: process.env.USER || "postgres",
  database: process.env.DATABASE || "school_db",
  dbPassword: process.env.DBPASS || "shivam",
  dbPort: process.env.DBPORT || 5432,
  max: process.env.POOLSIZE || 10, // Pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  sessionSecret: process.env.SESSION_SECRET || "your-secret-key",
  baseUrl: process.env.BASE_URL || "http://localhost:5000",

  // Social login configuration
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID || "facebook-app-id",
    clientSecret: process.env.FACEBOOK_APP_SECRET || "facebook-app-secret",
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || "google-client-id",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret",
  },
  twitter: {
    apiKey: process.env.TWITTER_API_KEY || "twitter-api-key",
    apiSecret: process.env.TWITTER_API_SECRET || "twitter-api-secret",
  },
  linkedin: {
    clientID: process.env.LINKEDIN_CLIENT_ID || "linkedin-client-id",
    clientSecret:
      process.env.LINKEDIN_CLIENT_SECRET || "linkedin-client-secret",
  },
};

export default config;
