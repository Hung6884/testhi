const { DataTypes, Model, Sequelize } = require('sequelize');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class EducationalLevel extends Model {}
  EducationalLevel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'id',
      },
      code: {
        type: DataTypes.STRING,
        field: 'ma',
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        field: 'mo_ta',
      },
      name: {
        type: DataTypes.STRING,
        field: 'ten',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'EducationalLevel',
      tableName: 'trinh_do_hoc_van',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      hasPrimaryKeys: true,
    },
  );

  return EducationalLevel;
};
