const config = {
  serverPort: process.env.PORT || 5000,
  dbUser: process.env.USER || "postgres",
  database: process.env.DATABASE || "school_db",
  dbPassword: process.env.DBPASS || "shivam",
  dbPort: process.env.DBPORT || 5432,
  max: process.env.POOLSIZE || 10, // Pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export default config;
