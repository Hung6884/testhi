const { DataTypes, Model, Sequelize } = require('sequelize');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class RFCard extends Model {}
  RFCard.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'rfid',
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'ma_the',
      },
      cardNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'so_the',
      },
      note: {
        type: DataTypes.STRING(510),
        allowNull: true,
        field: 'ghi_chu',
      },
      csdtCode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        field: 'ma_csdt',
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
        field: 'ngay_tao',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'RFCard',
      tableName: 'the_rf',
      timestamps: false,
    },
  );

  RFCard.associate = (models) => {
    RFCard.hasOne(models.Teacher, {
      sourceKey: 'code',
      foreignKey: 'rfidCode',
      as: 'teacher',
    });
    RFCard.hasOne(models.Student, {
      sourceKey: 'code',
      foreignKey: 'rfidCode',
      as: 'student',
    });
  };

  RFCard.beforeCreate(async (item, options) => {
    try {
      let dataIndex = await sequelize.models.DataIndex.findOne({
        where: { tableName: 'RFCard' },
        transaction: options.transaction,
      });

      if (!dataIndex) {
        dataIndex = await sequelize.models.DataIndex.create(
          {
            tableName: 'RFCard',
            tableIndex: 40871,
          },
          { transaction: options.transaction },
        );
      }
      const nextId = dataIndex.tableIndex + 1;

      !item.get('id') && item.set('id', nextId);

      await dataIndex.update(
        { tableIndex: nextId },
        { transaction: options.transaction },
      );
    } catch (error) {
      console.error(
        'Error while handle RF Card id and updating DataIndex:',
        error,
      );
      throw error;
    }
  });

  return RFCard;
};
