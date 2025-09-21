const { DataTypes, Model, Sequelize } = require('sequelize');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class TeachingSubject extends Model {}
  TeachingSubject.init(
    {
      code: {
        type: DataTypes.STRING,
        field: 'ma',
        primaryKey: true,
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
      modelName: 'TeachingSubject',
      tableName: 'mon_giang_day',
      timestamps: false,
    },
  );

  return TeachingSubject;
};
