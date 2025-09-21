const { DataTypes, Model, Sequelize } = require('sequelize');
const { courseMapping } = require('../../constant/mapping');
/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class Course extends Model {}

  Course.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: courseMapping.id,
      },
      report1Code: {
        type: DataTypes.STRING,
        allowNull: false,
        field: courseMapping.report1Code,
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: courseMapping.code,
      },
      csdtCode: {
        type: DataTypes.STRING(20),
        defaultValue: '40023', //TODO: se bo di khi trien khai nhieu csdt
        field: courseMapping.csdtCode,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: courseMapping.name,
      },
      trainingCategory: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: courseMapping.trainingCategory,
      },
      courseStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: courseMapping.courseStartDate,
      },
      courseEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: courseMapping.courseEndDate,
      },
      trainingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: courseMapping.trainingDate,
      },
      examinationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: courseMapping.examinationDate,
      },
      internalTraining: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: courseMapping.internalTraining,
      },
      createdDate: {
        type: DataTypes.TIME,
        defaultValue: Sequelize.NOW,
        field: courseMapping.createdDate,
      },
      updatedDate: {
        type: DataTypes.TIME,
        defaultValue: Sequelize.NOW,
        field: courseMapping.updatedDate,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: courseMapping.isActive,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: false,
      modelName: 'Course',
      tableName: 'khoa_hoc',
      indexes: [
        {
          unique: true,
          fields: ['ma_csdt', 'ma_kh'],
          name: 'khoa_hoc_ma_kh_ma_csdt_unique',
        },
      ],
    },
  );

  Course.beforeCreate(async (course, options) => {
    try {
      let dataIndex = await sequelize.models.DataIndex.findOne({
        where: { tableName: 'Course' },
        transaction: options.transaction,
      });

      if (!dataIndex) {
        dataIndex = await sequelize.models.DataIndex.create(
          {
            tableName: 'Course',
            tableIndex: 17,
          },
          { transaction: options.transaction },
        );
      }
      const nextId = dataIndex.tableIndex + 1;

      !course.get('id') && course.set('id', nextId);

      await dataIndex.update(
        { tableIndex: nextId },
        { transaction: options.transaction },
      );
    } catch (error) {
      console.error(
        'Error while setting course id and updating DataIndex:',
        error,
      );
      throw error;
    }
  });

  return Course;
};
