const R = require('ramda')

const { FieldValidationError } = require('../../helpers/errors')
const { generateContact } = require('../../helpers/mockData/contact')
const ContactDomain = require('./')

const contactDomain = new ContactDomain()

describe('contact-domain', () => {
  describe('contactCreateTest', async () => {
    let contactMockGenerated = {}
    let counter = 1

    beforeEach(() => {
      contactMockGenerated = generateContact(counter.toString())
      counter += 1
    })

    test('create contact with correct date', async () => {
      const contactMock = contactMockGenerated

      const contactCreated = await contactDomain.create(contactMock)

      expect(contactCreated.name).toEqual(contactMock.name)
      expect(contactCreated.email).toEqual(contactMock.email)
      expect(contactCreated.position).toEqual(contactMock.position)
      expect(contactCreated.phone).toEqual(contactMock.phone)
    })

    test('try add contact with name null', async () => {
      const chipMock = contactMockGenerated
      chipMock.name = ''

      await expect(contactDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'name',
          message: 'name cannot be null',
        }]))
    })

    test('try add contact without name', async () => {
      const chipMock = R.omit(['name'], contactMockGenerated)

      await expect(contactDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'name',
          message: 'name cannot be null',
        }]))
    })

    test('try add contact with email null', async () => {
      const chipMock = contactMockGenerated
      chipMock.email = ''

      await expect(contactDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'email',
          message: 'email cannot be null',
        }]))
    })

    test('try add contact omiting email', async () => {
      const chipMock = R.omit(['email'], contactMockGenerated)

      await expect(contactDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'email',
          message: 'email cannot be null',
        }]))
    })

    test('try add contact without email invalid', async () => {
      const chipMock = {
        ...contactMockGenerated,
        email: 'realponto@hotmail'
      }

      await expect(contactDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'email',
          message: 'email is invalid',
        }]))
    })


    test('try add contact with phone null', async () => {
      const chipMock = contactMockGenerated
      chipMock.phone = ''

      await expect(contactDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'phone',
          message: 'phone cannot be null',
        }]))
    })

    test('try add contact with phone wrong', async () => {
      const chipMock = contactMockGenerated
      chipMock.phone = '132awdawd31daw3d1'

      await expect(contactDomain.create(chipMock)).rejects
        .toThrowError()
    })

    test('try add contact omiting phone', async () => {
      const chipMock = R.omit(['phone'], contactMockGenerated)

      await expect(contactDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'phone',
          message: 'phone cannot be null',
        }]))
    })
  })

  describe('getContactByIdTest', () => {
    let chipMockGenerated = null
    let counter = 100

    beforeEach(async () => {
      const chipMock = generateContact(counter.toString())
      counter += 1
      chipMockGenerated = await contactDomain.create(chipMock)
    })

    test('get contact by id with correct date', async () => {
      const contactReturned = await contactDomain.contact_GetById(chipMockGenerated.id)

      expect(contactReturned.name).toEqual(chipMockGenerated.name)
      expect(contactReturned.email).toEqual(chipMockGenerated.email)
      expect(contactReturned.position).toEqual(chipMockGenerated.position)
      expect(contactReturned.phone).toEqual(chipMockGenerated.phone)
    })

    test('get contact by id equal null', async () => {
      await expect(contactDomain.contact_GetById(null))
        .rejects.toThrowError(new FieldValidationError([{
          field: 'id',
          message: 'id cannot be null',
        }]))
    })

    test('get contact with incorrect id', async () => {
      await expect(contactDomain.contact_GetById('uhul')).rejects
        .toThrowError(new FieldValidationError([{
          field: 'id',
          message: 'id is invalid',
        }]))
    })
  })

  describe('update contact by id', () => {
    let contactCreated = null
    let counter = 300

    beforeEach(async () => {
      const contactMock = generateContact(counter.toString())
      counter += 1
      contactCreated = await contactDomain.create(contactMock)
    })

    test('update contact by id with only name', async () => {
      const contactMock = R.omit(['email', 'position', 'phone'], contactCreated)
      contactMock.name = 'stain'

      const contactUpdate = await contactDomain.contact_UpdateById(contactCreated.id, contactMock)

      expect(contactUpdate.name).toEqual(contactMock.name)
      expect(contactUpdate.email).toEqual(contactCreated.email)
      expect(contactUpdate.position).toEqual(contactCreated.position)
      expect(contactUpdate.phone).toEqual(contactCreated.phone)
    })

    test('update conntact by id with only email', async () => {
      const contactMock = R.omit(['name', 'position', 'phone'], contactCreated)
      contactMock.email = 'guilherme@guilherme.com'

      const contactUpdate = await contactDomain.contact_UpdateById(contactCreated.id, contactMock)

      expect(contactUpdate.name).toEqual(contactCreated.name)
      expect(contactUpdate.position).toEqual(contactCreated.position)
      expect(contactUpdate.email).toEqual(contactMock.email)
      expect(contactUpdate.phone).toEqual(contactCreated.phone)
    })

    test('update conntact by id with only phone', async () => {
      const contactMock = R.omit(['name', 'position', 'email'], contactCreated)
      contactMock.phone = '11957712340'

      const contactUpdate = await contactDomain.contact_UpdateById(contactCreated.id, contactMock)

      expect(contactUpdate.name).toEqual(contactCreated.name)
      expect(contactUpdate.position).toEqual(contactCreated.position)
      expect(contactUpdate.email).toEqual(contactCreated.email)
      expect(contactUpdate.phone).toEqual(contactMock.phone)
    })
  })
})
