const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "orders",
  tableName: "orders",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
      nullable: false,
    },
    users_id: {
      type: "uuid",
      nullable: false,
    },
    name: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    tel: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    address: {
      type: "varchar",
      length: 320,
      nullable: false,
    },
    is_paid: {
      type: "bool",
      nullable: false,
      default: false,
    },
    paid_at: {
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
    payment_methods_id: {
      type: "smallint",
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
  },
  relations: {
    users: {
      target: "users",
      type: "many-to-one",
      joinColumn: {
        name: "users_id",
        referencedColumnName: "id",
        foreignKeyConstraintName: "orders_fk_users",
      },
    },
  },
});
