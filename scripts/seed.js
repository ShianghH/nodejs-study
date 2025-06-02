// scripts/seed.js
const { dataSource } = require("../db/data-source");
const { v4: uuidv4 } = require("uuid");

async function seed() {
  await dataSource.initialize();

  // Repositories
  const userRepo = dataSource.getRepository("users");
  const categoryRepo = dataSource.getRepository("product_categories");
  const productRepo = dataSource.getRepository("products");

  // ===== 1. 建立使用者假資料 =====
  const testUser = userRepo.create({
    name: "測試用戶",
    email: `test-${Date.now()}@example.com`, // 避免重複
    password: "hexSchool12345",
  });
  await userRepo.save(testUser);

  // ===== 2. 建立產品分類 =====
  const testCategory = categoryRepo.create({
    name: "測試分類",
  });
  await categoryRepo.save(testCategory);

  // ===== 3. 建立產品 =====
  const testProduct = productRepo.create({
    id: uuidv4(),
    name: "測試產品",
    description: "這是測試用的產品",
    image_url: "https://example.com/test.jpg",
    origin_price: 1000,
    price: 900,
    colors: JSON.stringify(["黑色"]),
    spec: JSON.stringify(["單人"]),
    enable: true,
    product_categories: testCategory,
  });
  await productRepo.save(testProduct);

  console.log("✅ 假資料建立完成！");
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error("❌ 建立假資料失敗:", err);
  process.exit(1);
});
