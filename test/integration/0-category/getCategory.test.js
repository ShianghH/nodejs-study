const {
  describe, it, expect, afterEach, beforeEach, beforeAll, afterAll
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@jest/globals')

const TestServer = require('../testServer')
const { dataSource } = require('../../../db/data-source')

const route = '/api/v1/category'

describe(`GET ${route}`, () => {
  let server
  beforeAll(async () => {
    server = await TestServer.getServer()
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('取得產品分類清單，回傳HTTP Code 200', async () => {
    const result = await server
      .get(route)
      .query({ page: 1 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(result.body.message).toEqual('成功')
    expect(Array.isArray(result.body.data)).toBe(true)
    result.body.data.forEach((item) => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(typeof item.id).toBe('string')
      expect(typeof item.name).toBe('string')
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
