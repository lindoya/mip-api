const R = require('ramda')

const { generateCompany } = require('../../../helpers/mockData/company')
const { generateCompanyGroup } = require('../../../helpers/mockData/company')
const { generateAddress } = require('../../../helpers/mockData/address')
const { generateContact } = require('../../../helpers/mockData/contact')

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
    let contactMockGenerated = {}
    let contactMockGenerated1 = {}
    let counter = 1

    beforeEach(() => {
      companyGroupMockGenerated = generateCompanyGroup(counter.toString())
      companyMockGenerated = generateCompany(counter)
      addressMockGenerated = generateAddress(counter.toString())
      contactMockGenerated = generateContact(counter)
      contactMockGenerated1 = generateContact(counter + 1)
      counter += 1
    })
    beforeEach(() => {
      addressMockGenerated = generateAddress(addressCounter.toString())
      addressCounter += 1
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
      const companyGroupMock = {
        ...companyGroupMockGenerated,
        cnpj: '1234567',
      }

      await expect(companyGroupDomain.create(companyGroupMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj is invalid',
        }]))
    })

    test('try adding two companyGroups with the same cnpj', async () => {
      const companyGroupMock = {
        ...companyGroupMockGenerated,
        cnpj: '27522457000112',
      }
      await companyGroupDomain.create(companyGroupMock)

      await expect(companyGroupDomain.create(companyGroupMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj already exists',
        }]))
    })

    test('try adding an existing cnpj with a company', async () => {
      const companyGroupMock1 = {
        ...companyMockGenerated,
        cnpj: '15640543000140',
      }
      const companyGroupMock2 = {
        ...companyGroupMockGenerated,
        cnpj: '15640543000140',
      }

      await companyDomain.create(companyGroupMock1)

      await expect(companyGroupDomain.create(companyGroupMock2)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj already exists',
        }]))
    })

    //   test('create companyGroup with correct address', async () => {
    //     const companyGroupMock = {
    //       ...companyGroupMockGenerated,
    //       address: addressMockGenerated,
    //     }

    //     const companyGroupCreated = await companyGroupDomain.create(companyGroupMock)

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

    test('add contact in companyGroup', async () => {
      const contactMock = await companyGroupDomain.create(companyGroupMockGenerated)

      await companyGroupDomain.addContactInCompanyGroup(contactMock.id, contactMockGenerated)

      const newContact1 = await companyGroupDomain
        .addContactInCompanyGroup(contactMock.id, contactMockGenerated1)

      expect(newContact1.contacts[0].name).toEqual(contactMockGenerated.name)
      expect(newContact1.contacts[0].email).toEqual(contactMockGenerated.email)
      expect(newContact1.contacts[0].position).toEqual(contactMockGenerated.position)
      expect(newContact1.contacts[0].phone).toEqual(contactMockGenerated.phone)
      expect(newContact1.contacts[1].name).toEqual(contactMockGenerated1.name)
      expect(newContact1.contacts[1].email).toEqual(contactMockGenerated1.email)
      expect(newContact1.contacts[1].position).toEqual(contactMockGenerated1.position)
      expect(newContact1.contacts[1].phone).toEqual(contactMockGenerated1.phone)
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
      const companyGroupReturned = await companyGroupDomain
        .companyGroup_GetById(companyGroupMockGenerated.id)

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
      const companyGroupUpdate = await companyGroupDomain
        .companyGroup_UpdateById(companyGroupMockGenerated.id, companyGroupMock)

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
})
