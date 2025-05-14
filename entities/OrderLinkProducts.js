const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'order_link_products',
  tableName: 'order_link_products',
  columns: {
    orders_id: {
      type: 'uuid',
      nullable: false,
      primary: true,
      primaryKeyConstraintName: 'order_link_products_composite_pk'
    },
    products_id: {
      type: 'uuid',
      nullable: false,
      primary: true,
      primaryKeyConstraintName: 'order_link_products_composite_pk'
    },
    quantity: {
      type: 'integer',
      nullable: false,
      default: 1
    },
    spec: {
      type: 'varchar',
      nullable: false,
      length: 100
    },
    colors: {
      type: 'varchar',
      nullable: false,
      length: 100
    }
  },
  primary: ['orders_id', 'products_id'],
  relations: {
    products: {
      target: 'products',
      type: 'many-to-one',
      inverseSide: 'order_link_products',
      joinColumn: {
        name: 'products_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'order_link_products_fk_products'
      },
      cascade: false
    },
    orders: {
      target: 'orders',
      type: 'many-to-one',
      inverseSide: 'order_link_products',
      joinColumn: {
        name: 'orders_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'order_link_products_fk_orders'
      },
      cascade: false
    }
  }
})