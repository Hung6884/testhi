const { DataTypes, Model, Sequelize } = require('sequelize');
const { trainingVehicleMapping } = require('../../constant/mapping');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class TrainingVehicle extends Model {}
  TrainingVehicle.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: trainingVehicleMapping.id,
      },
      licensePlate: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: trainingVehicleMapping.licensePlate,
      },
      owner: {
        type: DataTypes.STRING(510),
        allowNull: true,
        field: trainingVehicleMapping.owner,
      },
      issuingAuthority: {
        type: DataTypes.STRING(510),
        allowNull: true,
        field: trainingVehicleMapping.issuingAuthority,
      },
      drivingLicenseCategory: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: trainingVehicleMapping.drivingLicenseCategory,
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: trainingVehicleMapping.code,
      },
      csdtCode: {
        type: DataTypes.STRING,
        field: trainingVehicleMapping.csdtCode,
      },
      manufacturingYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: trainingVehicleMapping.manufacturingYear,
      },
      licenseIssueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: trainingVehicleMapping.licenseIssueDate,
      },
      licenseExpiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: trainingVehicleMapping.licenseExpiryDate,
      },
      registrationNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: trainingVehicleMapping.registrationNumber,
      },
      licenseNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: trainingVehicleMapping.licenseNumber,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        field: trainingVehicleMapping.isActive,
      },
      datDeviceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: trainingVehicleMapping.datDeviceId,
        references: {
          model: 'DatDevice',
          key: 'id',
        },
      },
      datDeviceSerial: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: trainingVehicleMapping.datDeviceSerial,
        references: {
          model: 'DatDevice',
          key: 'seriNumber',
        },
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'TrainingVehicle',
      tableName: 'xe_tap_lai',
      timestamps: false,
      indexes: [
        {
          name: 'xe_tap_lai_ma_xe_ma_csdt_unique',
          unique: true,
          fields: ['ma_xe', 'ma_csdt'],
        },
      ],
    },
  );

  TrainingVehicle.associate = (models) => {
    TrainingVehicle.belongsTo(models.DatDevice, {
      foreignKey: 'datDeviceId',
      as: 'datDevice',
    });
  };

  TrainingVehicle.beforeCreate(async (item, options) => {
    try {
      let dataIndex = await sequelize.models.DataIndex.findOne({
        where: { tableName: 'TrainingVehicle' },
        transaction: options.transaction,
      });

      if (!dataIndex) {
        dataIndex = await sequelize.models.DataIndex.create(
          {
            tableName: 'TrainingVehicle',
            tableIndex: 430,
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
        'Error while setting vehicle id and updating DataIndex:',
        error,
      );
      throw error;
    }
  });

  return TrainingVehicle;
};
