const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CategoryController");

const numberReg = /^[0-9]+$/;

const getCategories = async (req, res, next) => {
  try {
    const { page = 1, category = "" } = req.query;
    if (
      !numberReg.test(page) ||
      page < 1 ||
      page % 1 !== 0 ||
      typeof category !== "string"
    ) {
      res.status(400).json({
        status: "failed",
        message: "請輸入有效的頁數",
      });
      return;
    }
    logger.debug(`category: ${category}`);
    const pageToInt = parseInt(page, 10);
    const perPage = 10;
    const skip = (pageToInt - 1) * perPage;

    let categories;
    let total;

    if (category !== "") {
      // 有傳分類名稱就查詢單一分類
      const found = await dataSource
        .getRepository("product_categories")
        .findOne({
          select: ["id", "name", "created_at"],
          where: { name: category },
        });
      if (!found) {
        return res.status(400).json({
          status: "failed",
          message: "找不到該分類",
        });
      }
      categories = [found];
      total = 1;
    } else {
      // 否則查全部（含分頁）
      categories = await dataSource.getRepository("product_categories").find({
        select: ["id", "name", "created_at"],
        skip,
        take: perPage,
      });

      total = await dataSource.getRepository("product_categories").count();
    }

    res.status(200).json({
      status: "success",
      message: "成功",
      data: categories,
      pagination: {
        total,
        page: pageToInt,
        limit: perPage,
        total_page: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = {
  getCategories,
};
