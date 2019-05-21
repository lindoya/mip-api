const R = require('ramda')

const { generateCompany } = require('../../../helpers/mockData/company')
const { generateCompanyGroup } = require('../../../helpers/mockData/company')
const { generateAddress } = require('../../../helpers/mockData/address')

const CompanyDomain = require('../company')
const CompanyGroupDomain = require('../companyGroup')

const { FieldValidationError } = require('../../../helpers/errors')

const companyDomain = new CompanyDomain()
const companyGroupDomain = new CompanyGroupDomain()

describe('Company Group test', () => {
  describe('create company group', () => {
    let companyMockGenerated = {}
    let companyGroupMockGenerated = {}
    let addressMockGenerated = {}
    let counter = 1

    beforeEach(() => {
      companyGroupMockGenerated = generateCompanyGroup(counter.toString())
      companyMockGenerated = generateCompany(counter)
      addressMockGenerated = generateAddress(counter.toString())
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

    test('try adding a company with invalid cnpj', async () => {
      const chipMock = {
        ...companyGroupMockGenerated,
        cnpj: '1234567',
      }

      await expect(companyGroupDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj is invalid',
        }]))
    })

    test('try adding two companyGroups with the same cnpj', async () => {
      const chipMock = {
        ...companyGroupMockGenerated,
        cnpj: '27522457000112',
      }
      await companyGroupDomain.create(chipMock)

      await expect(companyGroupDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj already exists',
        }]))
    })

    test('try adding an existing cnpj with a company', async () => {
      const chipMock1 = {
        ...companyMockGenerated,
        cnpj: '15640543000140',
      }
      const chipMock2 = {
        ...companyGroupMockGenerated,
        cnpj: '15640543000140',
      }

      await companyDomain.create(chipMock1)

      await expect(companyGroupDomain.create(chipMock2)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj already exists',
        }]))
    })

    test('create companyGroup with correct address', async () => {
      const companyGroupMock = {
        ...companyGroupMockGenerated,
        address: addressMockGenerated,
      }

      console.log(JSON.stringify(addressMockGenerated))

      const companyGroupCreated = await companyGroupDomain.create(companyGroupMock)

      expect(companyGroupCreated.address.street).toBe(addressMockGenerated.street)
      expect(companyGroupCreated.address.number).toBe(addressMockGenerated.number)
      expect(companyGroupCreated.address.complement).toBe(addressMockGenerated.complement)
      expect(companyGroupCreated.address.city).toBe(addressMockGenerated.city)
      expect(companyGroupCreated.address.state).toBe(addressMockGenerated.state)
      expect(companyGroupCreated.address.neighborhood).toBe(addressMockGenerated.neighborhood)
      expect(companyGroupCreated.address.referencePoint).toBe(addressMockGenerated.referencePoint)
      expect(companyGroupCreated.address.zipCode).toBe(addressMockGenerated.zipCode)
      expect(companyGroupCreated.address.id).toBe(companyGroupCreated.addressId)
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

      await companyGroupDomain.companyGroup_GetAll(query)
    })
  })
})
