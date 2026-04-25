import mongoose from "mongoose";
import { PrismaClient } from "../src/generated";

const prisma = new PrismaClient();

// MongoDB connection string from environment
const MONGODB_URI =
  "mongodb+srv://omchauhan:om123@cluster0.tuqmj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function migrateData() {
  try {
    console.log("🔄 Starting migration from MongoDB to PostgreSQL...\n");

    // Connect to MongoDB
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get MongoDB collections
    const ProductModel = mongoose.model(
      "Product",
      new mongoose.Schema({
        name: String,
        description: String,
        price: Number,
        image: String,
        createdAt: Date,
        updatedAt: Date,
      })
    );

    const UserModel = mongoose.model(
      "User",
      new mongoose.Schema({
        name: String,
        email: { type: String, unique: true },
        phone: String,
        createdAt: Date,
        updatedAt: Date,
      })
    );

    const AdminModel = mongoose.model(
      "Admin",
      new mongoose.Schema({
        username: { type: String, unique: true },
        password: String,
        role: String,
        createdAt: Date,
        updatedAt: Date,
      })
    );

    // Migrate Products
    console.log("📦 Migrating Products...");
    const mongoProducts = await ProductModel.find({});
    console.log(`   Found ${mongoProducts.length} products`);

    for (const product of mongoProducts) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          createdAt: product.createdAt || new Date(),
          updatedAt: product.updatedAt || new Date(),
        },
      });
    }
    console.log(`✅ Migrated ${mongoProducts.length} products\n`);

    // Migrate Users
    console.log("👥 Migrating Users...");
    const mongoUsers = await UserModel.find({});
    console.log(`   Found ${mongoUsers.length} users`);

    for (const user of mongoUsers) {
      try {
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt || new Date(),
          },
        });
      } catch (error: any) {
        if (error.code === "P2002") {
          console.log(
            `   ⚠️  Skipping user ${user.email} (duplicate email)`
          );
        } else {
          console.error(`   ❌ Error creating user:`, error.message);
        }
      }
    }
    console.log(`✅ Migrated users\n`);

    // Migrate Admins
    console.log("🔐 Migrating Admin Users...");
    const mongoAdmins = await AdminModel.find({});
    console.log(`   Found ${mongoAdmins.length} admin users`);

    for (const admin of mongoAdmins) {
      try {
        await prisma.admin.create({
          data: {
            username: admin.username,
            password: admin.password,
            role: admin.role || "admin",
            createdAt: admin.createdAt || new Date(),
          },
        });
      } catch (error: any) {
        if (error.code === "P2002") {
          console.log(
            `   ⚠️  Skipping admin ${admin.username} (duplicate username)`
          );
        } else {
          console.error(`   ❌ Error creating admin:`, error.message);
        }
      }
    }
    console.log(`✅ Migrated ${mongoAdmins.length} admin users\n`);

    // Verification
    console.log("✨ Migration Summary:");
    const pgProducts = await prisma.product.count();
    const pgUsers = await prisma.user.count();
    const pgAdmins = await prisma.admin.count();

    console.log(`   📦 Products: ${pgProducts}`);
    console.log(`   👥 Users: ${pgUsers}`);
    console.log(`   🔐 Admins: ${pgAdmins}`);
    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    await prisma.$disconnect();
  }
}

migrateData();
