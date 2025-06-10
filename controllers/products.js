const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("ProductsController");
const { IsNull } = require("typeorm");

const {
  isUndefined,
  isNotValidString,
  isNotValidInteger,
  isNotValidUUID,
} = require("../utils/validators");

const numberReg = /^[0-9]+$/; //檢查一段字串是不是「只包含數字」

const getProducts = async (req, res, next) => {
  try {
    //從網址上的查詢參數拿 page 跟 category，如果沒填，預設page是第1頁，category 預設是空字串
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
    // 除錯用：輸出當前接收到的 category 分類參數，確認是否有成功從 query 取得
    logger.debug(`category: ${category}`);
    const pageToInt = parseInt(page, 10); //轉換 page 為整數（確保是十進位的正整數）
    const perPage = 10; // 每頁顯示的資料筆數
    const skip = (pageToInt - 1) * perPage; // 根據當前頁數計算需略過的資料筆數（例如第 2 頁會略過前 10 筆）

    let productCategory; //宣告一個可以重新賦值的變數

    // 如果有傳入分類，就查看看有沒有這個分類
    if (category !== "") {
      productCategory = await dataSource
        .getRepository("product_categories")
        .findOne({
          select: ["id"],
          where: {
            name: category,
          },
        });
      if (!productCategory) {
        // 若找不到對應的分類，回傳 400 錯誤訊息
        res.status(400).json({
          status: "failed",
          message: "找不到該分類",
        });
        return;
      }
    }
    // 設定查詢條件：僅搜尋尚未被刪除的產品（deleted_at 為 NULL）
    const productWhereOptions = {
      deleted_at: IsNull(),
    };
    if (productCategory) {
      // 若使用者有指定分類，將分類 ID 加入查詢條件
      // 只查詢該分類底下的產品資料
      productWhereOptions.product_categories_id = productCategory.id;
    }
    const products = await dataSource.getRepository("products").find({
      // 指定回傳的欄位
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        origin_price: true,
        price: true,
        created_at: true,
        product_categories: {
          id: true,
        },
      },
      // 設定查詢條件，例如：未被刪除、有指定分類的產品
      where: productWhereOptions,
      // 設定要連帶查詢的關聯資料（關聯 product_categories 表）
      relations: {
        product_categories: true,
      },
      // 排序：依照建立時間由新到舊（最新的商品排最前面）
      order: {
        created_at: "DESC",
      },
      // 分頁設定：一頁最多顯示幾筆資料
      take: perPage,
      // 略過的資料數（例如第2頁會 skip 前10筆）
      skip,
    });
    logger.debug(`products: ${JSON.stringify(products, null, 1)}`);
    // 查詢符合條件的產品總筆數（用於分頁資訊，例如：總共幾頁）
    const total = await dataSource.getRepository("products").count({
      where: productWhereOptions,
    });
    res.status(200).json({
      status: "success",
      message: "成功",
      data: {
        products: products.map(
          ({
            id,
            name,
            image_url: imageUrl,
            origin_price: originPrice,
            price,
            product_categories: productCategories,
          }) => ({
            id,
            name,
            category_id: productCategories.id, // 把分類物件拉平，只取分類名稱
            price,
            image_url: imageUrl,
            origin_price: originPrice,
          })
        ),
        pagination: {
          total,
          page: pageToInt, // 當前頁碼（來自 req.query）
          limit: perPage,
          total_page: Math.ceil(total / perPage), // 總頁數（總筆數 / 每頁筆數，無條件進位）
        },
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const getProductDetail = async (req, res, next) => {
  try {
    // 從 req.params 中取出路由參數 products_id，並重新命名為 productId，方便後續使用
    const { products_id: productId } = req.params;
    if (
      isUndefined(productId) ||
      isNotValidString(productId) ||
      isNotValidUUID(productId)
    ) {
      res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確",
      });
      return;
    }
    const productDetail = await dataSource.getRepository("products").findOne({
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        origin_price: true,
        price: true,
        colors: true,
        spec: true,
        product_categories: {
          name: true,
        },
        created_at: true,
        updated_at: true,
      },
      //根據 id 來查
      where: { id: productId },
      //這筆產品有跟分類表做關聯，把分類資料也查出來
      relations: {
        product_categories: true,
      },
    });
    if (!productDetail) {
      return res.status(404).json({
        status: "failed",
        message: "商品ID不存在",
      });
    }

    const productLinkTag = await dataSource
      .getRepository("product_link_tags")
      .find({
        select: {
          product_tags: {
            id: true,
            name: true,
          },
        },
        where: { products_id: productId },
        relations: {
          product_tags: true,
        },
      });
    logger.info(`productDetail: ${JSON.stringify(productDetail, null, 1)}`);
    logger.info(`productLinkTag: ${JSON.stringify(productLinkTag, null, 1)}`);
    res.status(200).json({
      status: "success",
      message: "成功",
      data: {
        id: productDetail.id,
        name: productDetail.name,
        category: productDetail.product_categories.name,
        price: productDetail.price,
        origin_price: productDetail.origin_price,
        //從 productLinkTag 陣列中，抽出每個元素裡面的 product_tags 欄位值，重新命名成 productTags
        tags: productLinkTag.map(
          ({ product_tags: ProductTags }) => ProductTags
        ),
        description: productDetail.description,
        image_url: productDetail.image_url,
        //「JSON 格式的字串」轉換成 JavaScript 可以操作的資料結構
        colors: JSON.parse(productDetail.colors),
        spec: JSON.parse(productDetail.spec),
        created_at: productDetail.created_at,
        updated_at: productDetail.updated_at,
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductDetail,
};
