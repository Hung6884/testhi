const { DataTypes, Model, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { trainingCategoryMapping } = require('../../constant/mapping');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class TrainingCategory extends Model {}
  TrainingCategory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: trainingCategoryMapping.id,
      },
      drivingLicenseCategory: {
        type: DataTypes.STRING(3),
        allowNull: false,
        field: trainingCategoryMapping.drivingLicenseCategory,
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: trainingCategoryMapping.code,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'ten_hang_dt',
      },
      createdDate: {
        type: DataTypes.TIME,
        defaultValue: Sequelize.NOW,
        field: trainingCategoryMapping.createdDate,
      },
      status: {
        type: DataTypes.BOOLEAN,
        field: trainingCategoryMapping.status,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: false,
      modelName: 'TrainingCategory',
      tableName: 'hang_dt',
    },
  );

  TrainingCategory.beforeCreate(async (category, options) => {
    try {
      let dataIndex = await sequelize.models.DataIndex.findOne({
        where: { tableName: 'TrainingCategory' },
        transaction: options.transaction,
      });

      if (!dataIndex) {
        dataIndex = await sequelize.models.DataIndex.create(
          {
            tableName: 'TrainingCategory',
            tableIndex: 508,
          },
          { transaction: options.transaction },
        );
      }
      const nextId = dataIndex.tableIndex + 1;

      !category.get('id') && category.set('id', nextId);

      await dataIndex.update(
        { tableIndex: nextId },
        { transaction: options.transaction },
      );
    } catch (error) {
      console.error(
        'Error while setting category training id and updating DataIndex:',
        error,
      );
      throw error;
    }
  });

  return TrainingCategory;
};
