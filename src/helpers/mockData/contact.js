const faker = require('faker')

const generateCellPhoneNumber = () => {
  const phoneRange = {
    min: 900000000,
    max: 999999999,
  }
  return `11${faker.random.number(phoneRange)}`
}

const generateContact = () => {
  const contactMock = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    // email: "real_ponto@hotmail.com",
    position: faker.name.jobArea(),
    phone: generateCellPhoneNumber(),
  }
  return contactMock
}

module.exports = {
  generateContact,
}
