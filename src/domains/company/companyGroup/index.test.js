const R = require('ramda')

const { generateCompanyGroup } = require('../../../helpers/mockData/company')
const CompanyGroupDomain = require('./')

const { FieldValidationError } = require('../../../helpers/errors')

const companyGroupDomain = new CompanyGroupDomain()

describe('Company Group test', () => {
  describe('create company group', () => {
    let companyGroupMockGenerated = {}
    let counter = 1

    beforeEach(() => {
      companyGroupMockGenerated = generateCompanyGroup(counter.toString())
      counter += 1
    })

    test('create company group with correct date', async () => {
      const companyGroupMock = companyGroupMockGenerated

      const companyGroupCreated = await companyGroupDomain.create(companyGroupMock)


      expect(companyGroupCreated.groupName).toEqual(companyGroupMock.groupName)
      expect(companyGroupCreated.description).toEqual(companyGroupMock.description)
    })

    test('try add company group with groupName existent', async () => {
      const companyGroupMock = companyGroupMockGenerated

      const companyGroupCreated = await companyGroupDomain.create(companyGroupMock)

      await expect(companyGroupCreated.groupName).toEqual(companyGroupMock.groupName)

      await expect(companyGroupDomain.create(companyGroupMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'groupName',
          message: 'groupName already exist',
        }]))
    })

    test('try add company group with groupName null', async () => {
      const companyGroupMock = companyGroupMockGenerated
      companyGroupMock.groupName = ''

      await expect(companyGroupDomain.create(companyGroupMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'groupName',
          message: 'groupName cannot be null',
        }]))
    })

    test('try add company group without groupName', async () => {
      const companyGroupMock = R.omit(['groupName'], companyGroupMockGenerated)

      await expect(companyGroupDomain.create(companyGroupMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'groupName',
          message: 'groupName cannot be null',
        }]))
    })

    test('try add company group with description null', async () => {
      const companyGroupMock = companyGroupMockGenerated
      companyGroupMock.description = ''

      await expect(companyGroupDomain.create(companyGroupMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'description',
          message: 'description cannot be null',
        }]))
    })

    test('try add company group without description', async () => {
      const companyGroupMock = R.omit(['description'], companyGroupMockGenerated)

      await expect(companyGroupDomain.create(companyGroupMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'description',
          message: 'description cannot be null',
        }]))
    })
  })

  describe('getCompanyGroupByIdTest', () => {
    let companyGroupMockGenerated = null
    let counter = 400

    beforeEach(async () => {
      const companyGroupMock = generateCompanyGroup(counter.toString())
      counter += 1
      companyGroupMockGenerated = await companyGroupDomain.create(companyGroupMock)
    })

    test('get company group by id with correct date', async () => {
      // eslint-disable-next-line max-len
      const companyGroupReturned = await companyGroupDomain.companyGroup_GetById(companyGroupMockGenerated.id)

      expect(companyGroupReturned.groupName).toEqual(companyGroupMockGenerated.groupName)
      expect(companyGroupReturned.description).toEqual(companyGroupMockGenerated.description)
    })

    test('get company group by id null', async () => {
      await expect(companyGroupDomain.companyGroup_GetById(null))
        .rejects.toThrowError(new FieldValidationError([{
          field: 'id',
          message: 'id cannot be null',
        }]))
    })

    test('get company group by incorrect id', async () => {
      await expect(companyGroupDomain.companyGroup_GetById('eda')).rejects
        .toThrowError(new FieldValidationError([{
          field: 'id',
          message: 'id is invalid',
        }]))
    })
  })

  describe('updateChipByIdTest', () => {
    let companyGroupMockGenerated = null
    let counter = 500

    beforeEach(async () => {
      const companyGroupMock = generateCompanyGroup(counter.toString())
      counter += 1
      companyGroupMockGenerated = await companyGroupDomain.create(companyGroupMock)
    })

    test('update company group by id with only groupName', async () => {
      const companyGroupMock = R.omit(['description'], companyGroupMockGenerated)
      companyGroupMock.groupName = 'eaeeee jooow'

      // eslint-disable-next-line max-len
      const companyGroupUpdate = await companyGroupDomain.companyGroup_UpdateById(companyGroupMockGenerated.id, companyGroupMock)

      expect(companyGroupUpdate.groupName).toEqual(companyGroupMock.groupName)
      expect(companyGroupUpdate.description).toEqual(companyGroupMockGenerated.description)
    })

    test('try update company group by id with groupName existent', async () => {
      const companyGroupMock = generateCompanyGroup('599')
      companyGroupMock.groupName = companyGroupMockGenerated.groupName

      await expect(companyGroupDomain.create(companyGroupMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'groupName',
          message: 'groupName already exist',
        }]))
    })

    test('update company group by id with only description', async () => {
      const companyGroupMock = R.omit(['groupName'], companyGroupMockGenerated)
      companyGroupMock.description = 'TESTEEEEE'

      // eslint-disable-next-line max-len
      const companyGroupUpdate = await companyGroupDomain.companyGroup_UpdateById(companyGroupMockGenerated.id, companyGroupMock)

      expect(companyGroupUpdate.groupName).toEqual(companyGroupMockGenerated.groupName)
      expect(companyGroupUpdate.description).toEqual(companyGroupMock.description)
    })
  })

  describe('get all tests', () => {
    test('getAll', async () => {
      const query = {}

      await companyGroupDomain.companyGroup_GetAll({ query })
    })
  })
})
