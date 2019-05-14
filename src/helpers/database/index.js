const db = require('../../database')

const dropAllTable = () => db.dropAllSchemas()

const isDatabaseConnected = () => db
  .authenticate()

const forceCreateTables = () => isDatabaseConnected()
  .then(() => db.sync({ force: true }))

const createUserAdmin = async () => {
  const User = db.model('user')
  const Login = db.model('login')

  const userAdmin = {
    name: 'realponto',
    username: 'modrp',
    email: 'joannisbs@gmail.com',
    login: {
      password: '102030',
    },
  }

  await User.create(userAdmin, { include: [Login] })
}

const createCompanyGroup = async () => {
  const CompanyGroup = db.model('companyGroup')
  const companyGroup = {
    groupName: 'Sem grupo',
    description: '-',
  }
  await CompanyGroup.create(companyGroup)
}


const dropAndDisconnectDatabase = () => db
  .close()

module.exports = {
  isDatabaseConnected,
  forceCreateTables,
  dropAndDisconnectDatabase,
  createUserAdmin,
  dropAllTable,
  createCompanyGroup,
}
