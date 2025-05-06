const {
  describe, it, expect, afterEach, beforeEach, beforeAll, afterAll
} = require('@jest/globals')
const { StatusCodes } = require('http-status-codes')
const { v4: uuidv4 } = require('uuid') // 🆕 加入 uuid 用來產生測試產品 id

const TestServer = require('../testServer')
const { dataSource } = require('../../../db/data-source')

const route = '/api/v1/products/:products_id'

describe(`GET ${route}`, () => {
  let server
  let requestRoute = '/api/v1/products'
  let targetProduct

  beforeAll(async () => {
    server = await TestServer.getServer()

    // 建立分類（若無）
    const categoryRepo = dataSource.getRepository('product_categories')
    let category = await categoryRepo.findOne({ where: { name: '測試分類' } })
    if (!category) {
      category = await categoryRepo.save(categoryRepo.create({ name: '測試分類' }))
    }

    // 建立產品（若無）
    const productRepo = dataSource.getRepository('products')
    let product = await productRepo.findOne({ where: { name: '測試產品' } }) // ✅ 這裡加 where
    if (!product) {
      product = productRepo.create({
        id: uuidv4(),
        name: '測試產品',
        description: '這是測試用的產品',
        image_url: 'https://example.com/test.jpg',
        origin_price: 1000,
        price: 900,
        colors: JSON.stringify(['黑色']),
        spec: JSON.stringify(['單人']),
        enable: true,
        product_categories: category
      })
      await productRepo.save(product)
    }

    targetProduct = product
    requestRoute = `${requestRoute}/${targetProduct.id}`
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('取得產品詳細資訊，回傳HTTP Code 200', async () => {
    const result = await server
      .get(requestRoute)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(result.body.message).toEqual('成功')
    expect(result.body.data).toHaveProperty('id')
    expect(result.body.data).toHaveProperty('category')
    expect(result.body.data).toHaveProperty('tags')
    expect(result.body.data).toHaveProperty('name')
    expect(result.body.data).toHaveProperty('description')
    expect(result.body.data).toHaveProperty('image_url')
    expect(result.body.data).toHaveProperty('origin_price')
    expect(result.body.data).toHaveProperty('price')
    expect(result.body.data).toHaveProperty('colors')
    expect(result.body.data).toHaveProperty('spec')
    expect(typeof result.body.data.id).toBe('string')
    expect(typeof result.body.data.category).toBe('string')
    expect(Array.isArray(result.body.data.tags)).toBe(true)
    result.body.data.tags.forEach((item) => {
      expect(typeof item.id).toBe('string')
      expect(typeof item.name).toBe('string')
    })
    expect(typeof result.body.data.name).toBe('string')
    expect(typeof result.body.data.description).toBe('string')
    expect(typeof result.body.data.image_url).toBe('string')
    expect(typeof result.body.data.origin_price).toBe('number')
    expect(typeof result.body.data.price).toBe('number')
    expect(Array.isArray(result.body.data.colors)).toBe(true)
    result.body.data.colors.forEach((item) => {
      expect(typeof item).toBe('string')
    })
    expect(Array.isArray(result.body.data.spec)).toBe(true)
    result.body.data.spec.forEach((item) => {
      expect(typeof item).toBe('string')
    })
  })

  it('資料庫發生錯誤，回傳HTTP Code 500', async () => {
    jest.spyOn(dataSource, 'getRepository').mockImplementation(() => {
      throw new Error('資料庫發生錯誤')
    })
    const result = await server
      .get(requestRoute)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
    expect(result.body.message).toEqual('伺服器錯誤')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await TestServer.close()
  })
})