const faker = require('faker')

const { generateAddress } = require('../../helpers/mockData/address')

const cnpjs = [
  '40190041000102',
  '32478461000160',
  '75460221000141',
  '86419666000102',
  '54236845000100',
  '31796778000182',
  '67238587000142',
  '38734326000115',
  '03487135000111',
  '17276186000109',
  '58139342000177',
  '11267253000142',
  '98409787000144',
  '43216467000186',
  '58484370000121',
  '60618092000108',
  '14355513000120',
  '43339443000114',
  '86857981000103',
  '23840780000183',
  '61073043000191',
  '61703219000141',
  '29787696000120',
  '04826644000194',
  '25691104000110',
]

const cnpjsGroup = [
  '80402204000198',
  '99405719000170',
  '25478062000134',
  '84915176000163',
  '65686661000168',
  '04845042000184',
  '71223509000141',
  '10909796000153',
  '80534876000157',
  '70326751000188',
  '26840405000121',
  '96607440000180',
  '75302234000192',
  '40848884000153',
  '33382943000185',
  '95837887000183',
  '87861809000196',
  '64133173000160',
  '90042739000159',
  '18655617000100',
  '69751276000108',
  '40108748000127',
  '78223449000106',
  '39502375000195',
  '59263638000168',
]


const generateCompanyGroup = (counter) => {
  const companyGroupMock = {
    groupName: faker.company.companyName(),
    description: faker.lorem.words(),
    cnpj: cnpjsGroup[counter],
  }
  return companyGroupMock
}

const generateCompany = (counter) => {
  const couterStr = counter.toString()
  const company = {
    type: 'master',
    cnpj: cnpjs[counter],
    razaoSocial: `${faker.company.companyName()} LTDA ${couterStr}`,
    name: `companyName${couterStr}`,
    stateRegistration: '123123123',
    address: generateAddress(),
  }
  return company
}

module.exports = {
  generateCompanyGroup,
  generateCompany,
}
