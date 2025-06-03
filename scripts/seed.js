const { dataSource } = require("../db/data-source");
const { v4: uuidv4 } = require("uuid");

async function seed() {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository("users");
  const categoryRepo = dataSource.getRepository("product_categories");
  const productRepo = dataSource.getRepository("products");
  const orderRepo = dataSource.getRepository("orders");
  const orderLinkRepo = dataSource.getRepository("order_link_products");

  // === 1. 建立使用者 ===
  const email = "admin@example.com";
  let user = await userRepo.findOne({ where: { email } });
  if (!user) {
    user = userRepo.create({
      name: "六角管理員",
      email,
      password: "hex12345",
    });
    await userRepo.save(user);
    console.log("使用者建立成功");
  } else {
    console.log("使用者已存在");
  }

  // === 2. 建立分類 ===
  const categoryName = "電競鍵盤";
  let category = await categoryRepo.findOne({ where: { name: categoryName } });
  if (!category) {
    category = categoryRepo.create({ name: categoryName });
    await categoryRepo.save(category);
    console.log("分類建立成功");
  } else {
    console.log("分類已存在");
  }

  // === 3. 建立產品 ===
  const productName = "六角 RGB 鍵盤";
  let product = await productRepo.findOne({ where: { name: productName } });
  if (!product) {
    product = productRepo.create({
      id: uuidv4(),
      name: productName,
      description: "具備 8000Hz 回報率的電競鍵盤",
      image_url: "https://example.com/keyboard.jpg",
      origin_price: 3200,
      price: 2890,
      colors: JSON.stringify(["黑色", "白色"]),
      spec: JSON.stringify(["有線版", "無線版"]),
      enable: true,
      product_categories: category,
    });
    await productRepo.save(product);
    console.log("產品建立成功");
  } else {
    console.log("產品已存在");
  }

  // === 4. 建立訂單 ===
  // 重新確認 user 是否存在
  const realUser = await userRepo.findOne({
    where: { email: "admin@example.com" },
  });
  if (!realUser || !realUser.id) {
    throw new Error("找不到使用者，無法建立訂單");
  }

  // 建立訂單，直接指定 users_id
  const order = orderRepo.create({
    users_id: realUser.id, //  指定 id
    name: "六角戰士",
    tel: "0912345678",
    address: "台北市六角街 99 號",
    payment_methods_id: 1,
    is_paid: true,
  });

  await orderRepo.save(order);

  // 建立 order_link_products
  const orderLink = orderLinkRepo.create({
    orders: order,
    products: product,
    quantity: 2,
    spec: "有線版",
    colors: "黑色",
  });
  await orderLinkRepo.save(orderLink);

  console.log("假訂單與產品連結建立成功");

  await dataSource.destroy();
  console.log("🎉 假資料全部建立完成");
}

seed().catch((err) => {
  console.error("建立假資料失敗:", err);
  process.exit(1);
});
