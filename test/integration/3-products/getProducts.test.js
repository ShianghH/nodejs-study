const {
  describe, it, expect, afterEach, beforeEach, beforeAll, afterAll
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@jest/globals')

const TestServer = require('../testServer')
const { dataSource } = require('../../../db/data-source')

const route = '/api/v1/products'

describe(`GET ${route}`, () => {
  let server
  let categoryName
  beforeAll(async () => {
    server = await TestServer.getServer()
    // 👇 建立預設分類（避免 category 為空）
    const defaultCategoryName = `測試分類-${Date.now()}`
    const categoryRepo = dataSource.getRepository('product_categories')
    await categoryRepo.save(categoryRepo.create({ name: defaultCategoryName }))
    categoryName = defaultCategoryName
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('取得產品清單，回傳HTTP Code 200', async () => {
    const result = await server
      .get(route)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(result.body.message).toEqual('成功')
    expect(result.body.data).toHaveProperty('products')
    expect(result.body.data).toHaveProperty('pagination')
    expect(result.body.data.pagination).toHaveProperty('total_page')
    expect(result.body.data.pagination).toHaveProperty('current_page')
    expect(typeof result.body.data.pagination.total_page).toBe('number')
    expect(typeof result.body.data.pagination.current_page).toBe('number')
    expect(result.body.data.pagination.current_page).toEqual(1)
    expect(Array.isArray(result.body.data.products)).toBe(true)
    result.body.data.products.forEach((item) => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('category')
      expect(item).toHaveProperty('description')
      expect(item).toHaveProperty('image_url')
      expect(item).toHaveProperty('origin_price')
      expect(item).toHaveProperty('price')
      expect(typeof item.id).toBe('string')
      expect(typeof item.name).toBe('string')
      expect(typeof item.category).toBe('string')
      expect(typeof item.description).toBe('string')
      expect(typeof item.image_url).toBe('string')
      expect(typeof item.origin_price).toBe('number')
      expect(typeof item.price).toBe('number')
    })
  })
  it('取得產品清單，回傳HTTP Code 200', async () => {
    const result = await server
      .get(route)
      .query({ page: 1, category: categoryName })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(result.body.message).toEqual('成功')
    expect(result.body.data).toHaveProperty('products')
    expect(result.body.data).toHaveProperty('pagination')
    expect(result.body.data.pagination).toHaveProperty('total_page')
    expect(result.body.data.pagination).toHaveProperty('current_page')
    expect(typeof result.body.data.pagination.total_page).toBe('number')
    expect(typeof result.body.data.pagination.current_page).toBe('number')
    expect(result.body.data.pagination.current_page).toEqual(1)
    expect(Array.isArray(result.body.data.products)).toBe(true)
    result.body.data.products.forEach((item) => {
      expect(typeof item.category).toBe('string')
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('category')
      expect(item).toHaveProperty('description')
      expect(item).toHaveProperty('image_url')
      expect(item).toHaveProperty('origin_price')
      expect(item).toHaveProperty('price')
      expect(typeof item.id).toBe('string')
      expect(typeof item.name).toBe('string')
      expect(typeof item.description).toBe('string')
      expect(typeof item.image_url).toBe('string')
      expect(typeof item.origin_price).toBe('number')
      expect(typeof item.price).toBe('number')
    })
  })
  it('資料庫發生錯誤，回傳HTTP Code 500', async () => {
    jest.spyOn(dataSource, 'getRepository').mockImplementation(() => {
      throw new Error('資料庫發生錯誤')
    })
    const result = await server
      .get(route)
      .query({ page: 1 })
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
