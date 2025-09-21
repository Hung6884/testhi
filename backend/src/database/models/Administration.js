const { DataTypes, Model, Sequelize } = require('sequelize');
const { administrationMapping } = require('../../constant/mapping');
/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class Administration extends Model {}

  Administration.init(
    {
      id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        primaryKey: true,
        field: administrationMapping.id,
      },
      fullName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: administrationMapping.fullName,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        field: administrationMapping.isActive,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: false,
      modelName: 'Administration',
      tableName: 'dvhc',
    },
  );

  // Administration.beforeCreate(async (item, options) => {
  //   try {
  //     let dataIndex = await sequelize.models.DataIndex.findOne({
  //       where: { tableName: 'Administration' },
  //       transaction: options.transaction,
  //     });

  //     if (!dataIndex) {
  //       dataIndex = await sequelize.models.DataIndex.create(
  //         {
  //           tableName: 'Administration',
  //           tableIndex: 508,
  //         },
  //         { transaction: options.transaction },
  //       );
  //     }
  //     const nextId = dataIndex.tableIndex + 1;

  //     !item.get('id') && item.set('id', nextId);

  //     await dataIndex.update(
  //       { tableIndex: nextId },
  //       { transaction: options.transaction },
  //     );
  //   } catch (error) {
  //     console.error(
  //       'Error while setting administration id and updating DataIndex:',
  //       error,
  //     );
  //     throw error;
  //   }
  // });

  return Administration;
};
