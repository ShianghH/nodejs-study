const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "products",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
      nullable: false,
    },
    product_categories_id: {
      type: "smallint",
      nullable: false,
    },
    name: {
      type: "varchar",
      length: 50,
      nullable: false,
      unique: true,
    },
    description: {
      type: "text",
      nullable: false,
    },
    image_url: {
      type: "varchar",
      length: 2048,
      nullable: false,
    },
    origin_price: {
      type: "integer",
      nullable: false,
    },
    price: {
      type: "integer",
      nullable: false,
    },
    colors: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    spec: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    enable: {
      type: "bool",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
      nullable: false,
    },
    deleted_at: {
      type: "timestamp",
      nullable: true,
    },
  },
  relations: {
    product_categories: {
      target: "product_categories",
      type: "many-to-one",
      joinColumn: {
        name: "product_categories_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "products_fk_product_categories",
      },
    },
    product_link_tags: {
      target: "product_link_tags",
      type: "one-to-many",
      inverseSide: "products",
      joinColumn: {
        name: "id",
        referencedColumnName: "products_id",
        foreignKeyConstraintName: "products_fk_product_link_tags",
      },
      cascade: false,
    },
  },
});
