const {
  describe, it, expect, afterEach, beforeEach, beforeAll
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@jest/globals')
const { StatusCodes } = require('http-status-codes')

const TestServer = require('../testServer')
const { dataSource } = require('../../../db/data-source')

const route = '/api/v1/orders/'

describe(`POST ${route}`, () => {
  let server
  let token
  const testUserInfo = {
    name: '測試用戶',
    email: `${new Date().getTime()}@example.com`,
    password: 'hexSchool12345'
  }
  const orderInfo = {
    user: {
      name: 'put測試用戶',
      tel: '0912345678',
      address: '六角幸福路'
    },
    orders: [],
    payment_methods: 1
  }
  beforeAll(async () => {
    server = await TestServer.getServer()
    await server
      .post('/api/v1/users/signup')
      .send(testUserInfo)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.CREATED)
    const loginResult = await server
      .post('/api/v1/users/signin')
      .send({
        email: testUserInfo.email,
        password: testUserInfo.password
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.CREATED)
    token = loginResult.body.data.token
    const products = await server
      .get('/api/v1/products')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
    const getProductDetail = await server
      .get(`/api/v1/products/${products.body.data.products[0].id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    orderInfo.orders = [{
      products_id: getProductDetail.body.data.id,
      quantity: 1,
      spec: getProductDetail.body.data.spec[0],
      colors: getProductDetail.body.data.colors[0]
    }]
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('未帶入token，回傳HTTP Code 401', async () => {
    const result = await server
      .post(route)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.UNAUTHORIZED)
    expect(result.body.message).toEqual('你沒有權限存取此資源')
  })

  it('不輸入user，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({})
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('不輸入user.name，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {}
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的user.name，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: 1234
        }
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('不輸入user.tel，回傳HTTP  Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name
        }
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的user.tel，回傳HTTP  Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: '99jojo'
        }
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('不輸入user.address，回傳HTTP  Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel
        }
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的user.address，回傳HTTP  Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: 12354
        }
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('不輸入order，回傳HTTP  Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        }
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('不輸入order，回傳HTTP  Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: []
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的order，回傳HTTP  Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: 666
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的order.products_id，回傳HTTP  Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: [{}]
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的order.products_id，回傳HTTP  Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: [{
          products_id: 111
        }]
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的order.quantity，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: [{
          products_id: orderInfo.orders[0].products_id
        }]
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的order.quantity，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: [{
          products_id: orderInfo.orders[0].products_id,
          quantity: 'test'
        }]
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的order.spec，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: [{
          products_id: orderInfo.orders[0].products_id,
          quantity: orderInfo.orders[0].quantity
        }]
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的order.spec，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: [{
          products_id: orderInfo.orders[0].products_id,
          quantity: orderInfo.orders[0].quantity,
          spec: 666
        }]
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的order.colors，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: [{
          products_id: orderInfo.orders[0].products_id,
          quantity: orderInfo.orders[0].quantity,
          spec: orderInfo.orders[0].spec
        }]
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的order.colors，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: [{
          products_id: orderInfo.orders[0].products_id,
          quantity: orderInfo.orders[0].quantity,
          spec: orderInfo.orders[0].spec,
          colors: 666
        }]
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的payment_methods，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: orderInfo.orders
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的payment_methods，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: orderInfo.orders,
        payment_methods: 4
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('輸入錯誤的payment_methods，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        user: {
          name: orderInfo.user.name,
          tel: orderInfo.user.tel,
          address: orderInfo.user.address
        },
        order: orderInfo.orders,
        payment_methods: 'test'
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })

  it('帶入正確的資訊，回傳HTTP Code 200', async () => {
    const result = await server
      .post(route)
      .send(orderInfo)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
    expect(result.body.message).toEqual('加入成功')
  })

  it('資料庫發生錯誤，回傳HTTP Code 500', async () => {
    jest.spyOn(dataSource, 'getRepository').mockImplementation(() => {
      throw new Error('資料庫發生錯誤')
    })
    const result = await server
      .post(route)
      .send(orderInfo)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(500)
    expect(result.body.message).toEqual('伺服器錯誤')
  })
  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })
  afterAll(async () => {
    await TestServer.close()
  })
})
