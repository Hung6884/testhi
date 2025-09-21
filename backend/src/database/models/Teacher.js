const { DataTypes, Model, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { isArray } = require('lodash');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class Teacher extends Model {}
  Teacher.init(
    {
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'anh_chup',
      },
      createdDate: {
        type: DataTypes.DATE,
        field: 'create_date',
      },
      address: {
        type: DataTypes.STRING,
        field: 'dia_chi',
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'giao_vien_id',
      },
      drivingLicenseCategory: {
        type: DataTypes.STRING,
        field: 'hang_gplx',
      },
      middleName: {
        type: DataTypes.STRING,
        field: 'ho_ten_dem',
      },
      isFinger: {
        type: DataTypes.BOOLEAN,
        field: 'is_finger',
      },
      isRfid: {
        type: DataTypes.BOOLEAN,
        field: 'is_rfid',
      },
      cndtCode: {
        type: DataTypes.STRING,
        field: 'ma_cndt',
      },
      csdtCode: {
        type: DataTypes.STRING,
        field: 'ma_csdt',
      },
      code: {
        type: DataTypes.STRING,
        field: 'ma_gv',
      },
      rfidCode: {
        type: DataTypes.STRING,
        field: 'ma_the_rfid',
      },
      educationalLevelCode: {
        type: DataTypes.STRING,
        field: 'ma_trinh_do_hoc_van',
      },
      birthday: {
        type: DataTypes.DATE,
        field: 'ngay_sinh',
      },
      isSendGeneralDepartment: {
        type: DataTypes.BOOLEAN,
        field: 'send_tong_cuc',
      },
      nationalId: {
        type: DataTypes.STRING,
        field: 'so_cmt',
      },
      phone: {
        type: DataTypes.STRING,
        field: 'so_dien_thoai',
      },
      rfidNumber: {
        type: DataTypes.STRING,
        field: 'so_the_rfid',
      },
      name: {
        type: DataTypes.STRING,
        field: 'ten_gv',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      fullName: {
        type: DataTypes.STRING,
        field: 'ten_day_du',
      },
      updatedDate: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_date',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'Teacher',
      tableName: 'giao_vien',
      timestamps: false,
      indexes: [
        {
          name: 'giao_vien_ma_gv_ma_csdt_unique',
          unique: true,
          fields: ['ma_gv', 'ma_csdt'],
        },
      ],
    },
  );

  Teacher.associate = (models) => {
    Teacher.hasOne(models.DrivingLicenseCategory, {
      sourceKey: 'drivingLicenseCategory',
      foreignKey: 'code',
      as: 'drivingLicenseCategoryTable',
    });
    Teacher.hasOne(models.EducationalLevel, {
      sourceKey: 'educationalLevelCode',
      foreignKey: 'code',
      as: 'educationalLevel',
    });

    /*  Teacher.hasMany(models.Student, {
      sourceKey: 'id',
      foreignKey: 'teacherId',
      as: 'educationalLevel',
    }); */
  };

  Teacher.beforeCreate(async (teacher, options) => {
    try {
      let dataIndex = await sequelize.models.DataIndex.findOne({
        where: { tableName: 'Teacher' },
        transaction: options.transaction,
      });

      if (!dataIndex) {
        dataIndex = await sequelize.models.DataIndex.create(
          {
            tableName: 'Teacher',
            tableIndex: 116,
          },
          { transaction: options.transaction },
        );
      }
      const nextId = dataIndex.tableIndex + 1;

      !teacher.get('id') && teacher.set('id', nextId);
      teacher.get('middleName') &&
        teacher.get('name') &&
        teacher.set(
          'fullName',
          teacher.get('middleName') + ' ' + teacher.get('name'),
        );

      await dataIndex.update(
        { tableIndex: nextId },
        { transaction: options.transaction },
      );
    } catch (error) {
      console.error(
        'Error while setting teacher id and updating DataIndex:',
        error,
      );
      throw error;
    }
  });

  return Teacher;
};
