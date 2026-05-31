import prisma from "./prisma";

const dbConnect = async () => {
  try {
    await prisma.$connect();

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);

    process.exit(1);
  }
};

export default dbConnect;