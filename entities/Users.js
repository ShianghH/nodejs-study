const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "users",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
      nullable: false,
    },
    role: {
      type: "varchar",
      default: "user",
      length: 5,
      nullable: false,
    },
    name: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 320,
      nullable: false,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 72,
      nullable: false,
    },
    tel: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    address: {
      type: "varchar",
      length: 320,
      nullable: true,
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
});


