const app = require("./app");

const { dataSource } = require("./db/data-source");

const PORT = process.env.PORT || 5500;

//初始化資料庫，成功後再啟動伺服器

(async () => {
  try {
    await dataSource.initialize();
    console.log("[Database] 連線與初始化成功");
  } catch (err) {
    console.error("[Database] 初始化失敗，錯誤原因：", err);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5500;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
