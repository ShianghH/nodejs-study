const {
  describe, it, expect, afterEach, beforeEach, beforeAll
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@jest/globals')
const { StatusCodes } = require('http-status-codes')

const TestServer = require('../testServer')
const { dataSource } = require('../../../db/data-source')

const route = '/api/v1/users/signup'

describe(`POST ${route}`, () => {
  let server
  const testUserInfo = {
    name: '測試用戶',
    email: `${new Date().getTime()}@example.com`,
    password: 'hexSchool12345'
  }
  beforeAll(async () => {
    server = await TestServer.getServer()
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('帶入錯誤的註冊資訊，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        name: '測試用戶',
        password: 'hexschool12345'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('欄位未填寫正確')
  })
  it('輸入格式錯誤的密碼，回傳HTTP Code 400', async () => {
    const result = await server
      .post(route)
      .send({
        ...testUserInfo,
        password: 'hexschool12345'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.BAD_REQUEST)
    expect(result.body.message).toEqual('密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長32個字')
  })
  it('帶入正確的註冊資訊，回傳HTTP Code 201', async () => {
    const result = await server
      .post(route)
      .send(testUserInfo)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.CREATED)
    expect(result.body.message).toEqual('註冊成功')
  })
  it('輸入重複的註冊資訊，回傳HTTP Code 201', async () => {
    const result = await server
      .post(route)
      .send(testUserInfo)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(StatusCodes.CONFLICT)
    expect(typeof result.body.message).toBe('string')
    expect(result.body.message).toBe('註冊失敗，Email 已被使用')
  })
  it('資料庫發生錯誤，回傳HTTP Code 500', async () => {
    jest.spyOn(dataSource, 'getRepository').mockImplementation(() => {
      throw new Error('資料庫發生錯誤')
    })
    const result = await server
      .post(route)
      .send(testUserInfo)
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
