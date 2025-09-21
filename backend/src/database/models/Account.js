const { DataTypes, Model, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { isArray } = require('lodash');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Account.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        field: 'account_id',
      },
      accountName: {
        type: DataTypes.STRING,
        field: 'account_name',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'active',
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'address',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'email',
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'full_name',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'hashed_password',
      },
      phone: {
        type: DataTypes.STRING,
        defaultValue: false,
        field: 'phone',
      },
      createdDate: {
        type: DataTypes.TIME,
        defaultValue: Sequelize.NOW,
        field: 'created_date',
      },
      //   last_login: {
      //     type: DataTypes.TIME,
      //     field: 'lastLogin',
      //   },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'Account',
      tableName: 'accounts',
      timestamps: false,
      hooks: {
        beforeBulkUpdate(accounts) {
          if (!isArray(accounts) && accounts) {
            accounts = [accounts];
          }
          for (const account of accounts) {
            if (account.fields.password) {
              const salt = bcrypt.genSaltSync();
              account.password = bcrypt.hashSync(account.password, salt);
            }
          }
        },
        beforeBulkCreate(accounts) {
          for (const account of accounts) {
            if (account.changed('password')) {
              const salt = bcrypt.genSaltSync();
              account.password = bcrypt.hashSync(account.password, salt);
            }
          }
        },
        beforeSave(account) {
          if (account.changed('password')) {
            const salt = bcrypt.genSaltSync();
            account.password = bcrypt.hashSync(account.password, salt);
          }
        },
      },
    },
  );

  Account.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  //   Account.associate = (models) => {
  //     Account.belongsToMany(models.Role, {
  //       through: models.UserRole,
  //       foreignKey: 'accountId',
  //       as: 'roles',
  //     });
  //     Account.belongsTo(models.Employee, {
  //       foreignKey: 'employeeId',
  //       as: 'employee',
  //     });
  //   };

  return Account;
};
