const R = require('ramda')
const { isUUID } = require('validator')

const { FieldValidationError } = require('../../helpers/errors')

const database = require('../../database')

const Contact = database.model('contact')

class ContactDomain {
  // eslint-disable-next-line camelcase
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    const contact = R.omit(['id'], bodyData)

    const contactNotHas = prop => R.not(R.has(prop, contact))

    if (contactNotHas('name') || !contact.name) {
      throw new FieldValidationError([{
        field: 'name',
        message: 'name cannot be null',
      }])
    }

    // eslint-disable-next-line no-useless-escape
    if (!/^[\w\s\.À-ú\-]+$/.test(contact.name)) {
      throw new FieldValidationError([{
        field: 'name',
        message: 'type only letter and numbers',
      }])
    }

    if (contactNotHas('email') || !contact.email) {
      throw new FieldValidationError([{
        field: 'email',
        message: 'email cannot be null',
      }])
    }

    const { email } = contact

    // eslint-disable-next-line no-useless-escape
    if (!/^[\w_\-\.]+@[\w_\-\.]{2,}\.[\w]{2,}(\.[\w])?/.test(email)) {
      throw new FieldValidationError([{
        field: 'email',
        message: 'email is inválid',
      }])
    }

    if (contactNotHas('position') || !contact.position) {
      throw new FieldValidationError([{
        field: 'position',
        message: 'position cannot be null',
      }])
    }

    if (contactNotHas('phone') || !contact.phone) {
      throw new FieldValidationError([{
        field: 'phone',
        message: 'phone cannot be null',
      }])
    }

    const { phone } = contact

    if (!/^[0-9]{10,11}$/.test(phone)) {
      throw new FieldValidationError([{
        field: 'phone',
        message: 'phone is inválid',
      }])
    }

    const contactCreated = await Contact.create(contact, {
      transaction,
    })

    const chipReturned = await Contact.findByPk(
      contactCreated.id, {
        transaction,
      },
    )

    return chipReturned
  }

  // eslint-disable-next-line camelcase
  async contact_GetById(id, options = {}) {
    const { transaction = null } = options

    if (!id) {
      throw new FieldValidationError([{
        name: 'id',
        message: 'id cannot to be null',
      }])
    }

    if (!isUUID(id)) {
      throw new FieldValidationError([{
        name: 'id',
        message: 'id is invalid',
      }])
    }

    const contactReturned = await Contact.findByPk(id, {
      transaction,
    })
    return contactReturned
  }

  // eslint-disable-next-line camelcase
  async contact_UpdateById(id, bodyData, options = {}) {
    const { transaction = null } = options

    const contact = R.omit(['id'], bodyData)

    const contactHas = prop => R.has(prop, contact)

    let newContact = {}

    if (contactHas('name')) {
      newContact = {
        ...newContact,
        name: R.prop('name', contact),
      }
    }

    if (contactHas('email')) {
      newContact = {
        ...newContact,
        email: R.prop('email', contact),
      }
    }

    if (contactHas('phone')) {
      newContact = {
        ...newContact,
        phone: R.prop('phone', contact),
      }
    }
    const contactInstance = await this.contact_GetById(id, { transaction })

    await contactInstance.update(newContact)

    const contactUpdated = await this.contact_GetById(id, { transaction })

    return contactUpdated
  }
}

module.exports = ContactDomain
