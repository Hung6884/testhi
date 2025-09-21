const { DataTypes, Model, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { isArray } = require('lodash');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class DrivingLicenseCategory extends Model {}
  DrivingLicenseCategory.init(
    {
      note: {
        type: DataTypes.STRING,
        field: 'ghi_chu',
      },
      expired: {
        type: DataTypes.INTEGER,
        field: 'han_su_dung',
      },
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        field: 'id',
      },
      licenseId: {
        type: DataTypes.INTEGER,
        field: 'license_id',
      },
      code: {
        type: DataTypes.STRING,
        field: 'ma_hang',
      },
      desciption: {
        type: DataTypes.STRING,
        field: 'mo_ta_vn',
      },
      createdDate: {
        type: DataTypes.DATEONLY,
        field: 'ngay_tao',
      },
      name: {
        type: DataTypes.STRING,
        field: 'ten_hang',
      },
      status: {
        type: DataTypes.BOOLEAN,
        field: 'trang_thai',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'DrivingLicenseCategory',
      tableName: 'hang_gplx',
      timestamps: false,
    },
  );

  DrivingLicenseCategory.associate = (models) => {
    DrivingLicenseCategory.belongsTo(models.Teacher, {
      targetKey: 'drivingLicenseCategory',
      foreignKey: 'code',
    });
  };

  return DrivingLicenseCategory;
};
