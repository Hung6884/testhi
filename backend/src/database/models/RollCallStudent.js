const { DataTypes, Model, Sequelize } = require('sequelize');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class RollCallStudent extends Model {}
  RollCallStudent.init(
    {
      uuid: {
        type: DataTypes.UUIDV1,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        field: 'diem_danh_nguoi_lx_id',
      },
      rollCallTeacherUUID: {
        type: DataTypes.UUIDV1,
        allowNull: false,
        field: 'diem_danh_giao_vien_id',
      },
      studentCode: {
        type: DataTypes.STRING,
        field: 'ma_dk',
      },
      teacherCode: {
        type: DataTypes.STRING,
        field: 'ma_gv',
      },
      licensePlate: {
        type: DataTypes.STRING,
        field: 'bien_so',
      },
      isLogout: {
        type: DataTypes.BOOLEAN,
        field: 'logout',
      },
      lat: {
        type: DataTypes.DOUBLE,
        field: 'lat',
      },
      logoutLat: {
        type: DataTypes.DOUBLE,
        field: 'lat_logout',
      },
      lng: {
        type: DataTypes.DOUBLE,
        field: 'lng',
      },
      logoutLng: {
        type: DataTypes.DOUBLE,
        field: 'lng_logout',
      },
      loginDate: {
        type: DataTypes.DATE,
        field: 'thoi_diem',
      },
      logoutDate: {
        type: DataTypes.DATE,
        field: 'thoi_diem_logout',
      },
      lastDataDate: {
        type: DataTypes.DATE,
        field: 'thoi_diem_last_data',
      },
      trainingSession: {
        type: DataTypes.STRING,
        field: 'phien_dao_tao',
      },
      teacherId: {
        type: DataTypes.INTEGER,
        field: 'giao_vien_id',
      },
      studentId: {
        type: DataTypes.BIGINT,
        field: 'nguoi_lx_id',
      },
      csdtCode: {
        type: DataTypes.STRING,
        field: 'ma_csdt',
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        field: 'vehicle_id',
      },
      numberOfRecognition: {
        type: DataTypes.INTEGER,
        field: 'so_lan_nhan_dien',
      },
      numberOfSuccessRecognition: {
        type: DataTypes.INTEGER,
        field: 'so_lan_nhan_dien_thanh_cong',
      },
      totalDistances: {
        type: DataTypes.DOUBLE,
        field: 'tong_quang_duong',
      },
      totalTimes: {
        type: DataTypes.DOUBLE,
        field: 'tong_thoi_gian',
      },
      totalDistancesB11: {
        type: DataTypes.DOUBLE,
        field: 'quang_duong_b_11',
      },
      totalTimesB11: {
        type: DataTypes.DOUBLE,
        field: 'thoi_gian_b_11',
      },
      totalDistancesOfSession: {
        type: DataTypes.DOUBLE,
        field: 'tong_quang_duong_ld_phien',
      },
      totalTimesOfSession: {
        type: DataTypes.DOUBLE,
        field: 'tong_thoi_gian_ld_phien',
      },
      totalNightDistancesOfSession: {
        type: DataTypes.DOUBLE,
        field: 'tong_quang_duong_ld_ban_dem',
      },
      totalNightTimesOfSession: {
        type: DataTypes.DOUBLE,
        field: 'tong_thoi_gian_ld_ban_dem',
      },
      isActiveSession: {
        type: DataTypes.BOOLEAN,
        field: 'active_phien',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'RollCallStudent',
      tableName: 'diem_danh_nguoi_lx',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      hasPrimaryKeys: true,
    },
  );

  RollCallStudent.associate = (models) => {
    RollCallStudent.hasMany(models.HistoryData, {
      sourceKey: 'uuid',
      foreignKey: 'rollCallStudentUUID',
      as: 'historyDatas',
    });
  };

  return RollCallStudent;
};
