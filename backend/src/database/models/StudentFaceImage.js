const { DataTypes, Model, Sequelize } = require('sequelize');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class StudentFaceImage extends Model {}
  StudentFaceImage.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'picture_id',
      },
      imageCategory: {
        type: DataTypes.STRING(15),
        field: 'loai_anh',
      },
      imageType: {
        type: DataTypes.INTEGER,
        field: 'kieu_anh',
      },
      url: {
        type: DataTypes.STRING(255),
        field: 'url',
      },
      studentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'nguoi_lx_id',
      },
      /*  courseId: { 
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'khoa_hoc_id',
      },
      studentCode: {
        type: DataTypes.STRING(510),
        field: 'ma_dk',
      },
      csdtCode: {
        type: DataTypes.STRING(30),
        allowNull: true,
        field: 'ma_csdt',
      }, */
      createdDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
        field: 'create_date',
      },
      addedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
        field: 'add_dated',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'StudentFaceImage',
      tableName: 'nguoi_lx_face',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['nguoi_lx_id', 'kieu_anh', 'loai_anh'],
        },
      ],
    },
  );

  StudentFaceImage.associate = (models) => {
    StudentFaceImage.belongsTo(models.Student, {
      targetKey: 'id',
      foreignKey: 'studentId',
    });
  };

  StudentFaceImage.beforeCreate(async (item, options) => {
    try {
      let dataIndex = await sequelize.models.DataIndex.findOne({
        where: { tableName: 'StudentFaceImage' },
        transaction: options.transaction,
      });

      if (!dataIndex) {
        dataIndex = await sequelize.models.DataIndex.create(
          {
            tableName: 'StudentFaceImage',
            tableIndex: 101,
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
        'Error while handle student face image id and updating DataIndex:',
        error,
      );
      throw error;
    }
  });

  return StudentFaceImage;
};
