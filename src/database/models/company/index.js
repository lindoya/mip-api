const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const company = sequelize.define('company', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    type: {
      type: Sequelize.ENUM(
        'master',
        'branch',
        'unit',
      ),
    },

    razaoSocial: {
      type: Sequelize.STRING,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
      // unique: true,
    },

    nickname: { // name that will show in cards
      type: Sequelize.STRING,
    },

    stateRegistration: {
      type: Sequelize.STRING,
      defaultValue: 'isento',
    },

    cnpj: {
      type: Sequelize.STRING,
    },
  })

  company.associate = (models) => {
    company.belongsTo(models.address, {
      foreignKey: {
        allowNull: false,
      },
    })

    company.belongsToMany(models.contact, {
      through: 'companyContact',
    })

    company.belongsTo(models.company, {
      foreignKey: {
        defaultValue: null,
      },
    })

    company.belongsTo(models.companyGroup, {
      foreignKey: {
        defaultValue: null,
        allowNull: true,
      },
    })

    company.hasMany(models.companyEvent)
  }


  return company
}
