const { DataTypes, Model, Sequelize } = require('sequelize');
const { datDeviceMapping } = require('../../constant/mapping');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class DatDevice extends Model {}
  DatDevice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: datDeviceMapping.id,
      },
      serialNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: datDeviceMapping.serialNumber,
      },
      simNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: datDeviceMapping.simNumber,
      },
      deviceType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'DAT',
        field: datDeviceMapping.deviceType,
      },
      handoverDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: datDeviceMapping.handoverDate,
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: datDeviceMapping.expiryDate,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: datDeviceMapping.status,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'DatDevice',
      tableName: 'dat_device',
      timestamps: false,
    },
  );

  DatDevice.associate = (models) => {
    DatDevice.hasOne(models.TrainingVehicle, {
      foreignKey: 'datDeviceId',
      as: 'vehicle',
    });
  };

  DatDevice.beforeCreate(async (item, options) => {
    try {
      let dataIndex = await sequelize.models.DataIndex.findOne({
        where: { tableName: 'DatDevice' },
        transaction: options.transaction,
      });

      if (!dataIndex) {
        dataIndex = await sequelize.models.DataIndex.create(
          {
            tableName: 'DatDevice',
            tableIndex: 100,
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
        'Error while setting DAT device id and updating DataIndex:',
        error,
      );
      throw error;
    }
  });

  return DatDevice;
};
