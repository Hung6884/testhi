const { DataTypes, Model, Sequelize } = require('sequelize');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class HistoryData extends Model {}
  HistoryData.init(
    {
      id: {
        type: DataTypes.UUIDV1,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'history_id',
      },
      licensePlate: {
        type: DataTypes.STRING(15),
        allowNull: false,
        field: 'bien_so',
      },
      createdDate: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'create_date',
      },
      rollCallStudentUUID: {
        type: DataTypes.UUIDV1,
        allowNull: false,
        field: 'diem_danh_nguoi_lx_id',
      },
      teacherId: {
        type: DataTypes.INTEGER,
        field: 'giao_vien_id',
      },
      imei: {
        type: DataTypes.STRING(50),
        field: 'imei',
      },
      lat: {
        type: DataTypes.DOUBLE,
        field: 'lat',
      },
      lng: {
        type: DataTypes.DOUBLE,
        field: 'lng',
      },
      csdtCode: {
        type: DataTypes.STRING(20),
        field: 'ma_csdt',
      },
      studentCode: {
        type: DataTypes.STRING,
        field: 'ma_dk',
      },
      studentId: {
        type: DataTypes.BIGINT,
        field: 'nguoi_lx_id',
      },
      imagePath: {
        type: DataTypes.STRING,
        field: 'path_image',
      },
      trainingSession: {
        type: DataTypes.STRING,
        field: 'phien_dao_tao',
      },
      time: {
        type: DataTypes.DATE,
        field: 'thoi_diem',
      },
      /*totalDistancesOfSession: {
        type: DataTypes.DOUBLE,
        field: 'tong_quang_duong_ld_phien',
      },
      totalTimesOfSession: {
        type: DataTypes.DOUBLE,
        field: 'tong_thoi_gian_ld_phien',
      },
      totalDistancesOfLD: {
        type: DataTypes.DOUBLE,
        field: 'tong_quang_duong_ld',
      },
      totalTimesOfSession: {
        type: DataTypes.DOUBLE,
        field: 'tong_thoi_gian_ld_phien',
      },
       speed: {
        type: DataTypes.DOUBLE,
        field: 'van_toc',
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        field: 'vehicle_id',
      }, */
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'HistoryData',
      tableName: 'history_data',
      timestamps: false,
    },
  );

  HistoryData.associate = (models) => {
    HistoryData.associate = (models) => {
      HistoryData.belongsTo(models.RollCallStudent, {
        foreignKey: 'rollCallStudentUUID',
      });
    };
  };

  HistoryData.beforeCreate(async (item, options) => {
    try {
      let dataIndex = await sequelize.models.DataIndex.findOne({
        where: { tableName: 'HistoryData' },
        transaction: options.transaction,
      });

      if (!dataIndex) {
        dataIndex = await sequelize.models.DataIndex.create(
          {
            tableName: 'HistoryData',
            tableIndex: 1,
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
        'Error while handle History data id and updating DataIndex:',
        error,
      );
      throw error;
    }
  });

  return HistoryData;
};
