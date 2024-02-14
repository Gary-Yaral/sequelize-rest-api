const db = require('../database/config')
const Sequelize = require('sequelize')
const User = require('./userModel')
const Role = require('./roleModel')
const UserStatus = require('./userStatusModel')

const UserRoles = db.define(
  'UserRoles',
  {
    roleId:  {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id',
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    statusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: UserStatus,
        key: 'id',
      },
    },
  },
  { 
    tableName: 'user_roles',
    timestamps: false
  } 
)

// Establecemos las relaciones entre modelos
User.hasMany(UserRoles, { foreignKey: 'userId' })
UserRoles.belongsTo(User, { foreignKey: 'userId' })

Role.hasMany(UserRoles, { foreignKey: 'roleId' })
UserRoles.belongsTo(Role, { foreignKey: 'roleId' })

UserStatus.hasMany(UserRoles, { foreignKey: 'statusId' })
UserRoles.belongsTo(UserStatus, { foreignKey: 'statusId' })

UserRoles.sync()
  .then(() => {
    console.log('UserRoles table has been synchronized')
  })
  .catch((err) => {
    console.log(err)
  })

module.exports = UserRoles
