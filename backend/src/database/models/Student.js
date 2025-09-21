const { DataTypes, Model, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { isArray } = require('lodash');

/**
 *
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
  class Student extends Model {}
  Student.init(
    {
      rfidAddedDate: {
        type: DataTypes.DATE,
        field: 'add_date_rfid',
      },
      isReserveResult: {
        type: DataTypes.BOOLEAN,
        field: 'bao_luu_kq',
      },
      countSendData: {
        type: DataTypes.INTEGER,
        field: 'count_send_data',
      },
      createdDate: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'create_date',
      },
      teacherId: {
        type: DataTypes.INTEGER,
        field: 'giao_vien_id',
      },
      gender: {
        type: DataTypes.STRING,
        field: 'gioi_tinh',
      },
      trainingCategory: {
        type: DataTypes.STRING,
        field: 'hang_dao_tao',
      },
      drivingLicenseCategory: {
        type: DataTypes.STRING,
        field: 'hang_gplx',
      },
      middleName: {
        type: DataTypes.STRING,
        field: 'ho_dem_nlx',
      },
      fullName: {
        type: DataTypes.STRING,
        field: 'ho_va_ten',
      },
      isTraining: {
        type: DataTypes.BOOLEAN,
        field: 'is_dao_tao',
      },
      isFaceId: {
        type: DataTypes.BOOLEAN,
        field: 'is_face_id',
      },
      isFinger: {
        type: DataTypes.BOOLEAN,
        field: 'is_finger',
      },
      isRFID: {
        type: DataTypes.BOOLEAN,
        field: 'is_rfid',
      },
      theoryResult: {
        type: DataTypes.STRING,
        field: 'ket_qua_hoc_ly_thuyet',
      },
      courseId: {
        type: DataTypes.INTEGER,
        field: 'khoa_hoc_id',
      },
      csdtCode: {
        type: DataTypes.STRING,
        field: 'ma_csdt',
      },
      code: {
        type: DataTypes.STRING,
        field: 'ma_dk',
      },
      trainingVehicleCode: {
        type: DataTypes.STRING,
        field: 'ma_xe_tap',
      },
      nationalIdIssueDate: {
        type: DataTypes.DATE,
        field: 'ngay_cap_cmt',
      },
      birthday: {
        type: DataTypes.DATE,
        field: 'ngay_sinh',
      },
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'nguoi_lxid',
      },
      residence: {
        type: DataTypes.STRING,
        field: 'noi_ct',
      },
      permanentResidence: {
        type: DataTypes.STRING,
        field: 'noi_tt',
      },
      b11Distance: {
        type: DataTypes.BIGINT,
        field: 'quang_duong_b_11',
      },
      nightDistance: {
        type: DataTypes.BIGINT,
        field: 'quang_duong_ban_dem',
      },
      nationality: {
        type: DataTypes.STRING,
        field: 'quoc_tich',
      },
      rfidCode: {
        type: DataTypes.STRING,
        field: 'rfid',
      },
      isSendGeneralDepartment: {
        type: DataTypes.BOOLEAN,
        field: 'send_tong_cuc',
      },
      nationalId: {
        type: DataTypes.STRING,
        field: 'so_cmt',
      },
      phone: {
        type: DataTypes.STRING,
        field: 'so_dien_thoai',
      },

      numberOfTheoryHours: {
        type: DataTypes.STRING,
        field: 'so_gio_hoc_ly_thuyet',
      },
      rfidNumber: {
        type: DataTypes.STRING,
        field: 'so_the_rfid',
      },
      courseName: {
        type: DataTypes.STRING,
        field: 'ten_kh',
      },
      name: {
        type: DataTypes.STRING,
        field: 'ten_nlx',
      },
      startTimeLd: {
        type: DataTypes.DATE,
        field: 'thoi_diem_bat_dau_ld',
      },
      datStartTime: {
        type: DataTypes.DATE,
        field: 'thoi_diem_chay_dat',
      },
      datEndTime: {
        type: DataTypes.DATE,
        field: 'thoi_diem_ket_thuc_dat',
      },
      lastTimeLd: {
        type: DataTypes.DATE,
        field: 'thoi_diem_tap_cuoi_ld',
      },
      b11Time: {
        type: DataTypes.DOUBLE,
        field: 'thoi_gian_b_11',
      },
      nightTime: {
        type: DataTypes.DOUBLE,
        field: 'thoi_gian_ban_dem',
      },
      totalOfLdDistance: {
        type: DataTypes.DOUBLE,
        field: 'tong_quang_duong_ld',
      },
      totalOfLdTime: {
        type: DataTypes.INTEGER,
        field: 'tong_thoi_gian_ld',
      },
      b11Card: {
        type: DataTypes.STRING,
        field: 'xe_b_11',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
      updatedDate: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_date',
      },
      avatar: {
        type: DataTypes.STRING,
        field: 'anh_chup',
      },
      courseCode: {
        type: DataTypes.STRING(20),
        field: 'ma_kh',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'Student',
      tableName: 'nguoi_lx',
      timestamps: false,
      indexes: [
        {
          name: 'nguoi_lx_ma_dk_ma_kh_ma_csdt_unique',
          unique: true,
          fields: ['ma_dk', 'ma_kh', 'ma_csdt'],
        },
      ],
    },
  );

  Student.associate = (models) => {
    Student.hasMany(models.StudentFaceImage, {
      sourceKey: 'id',
      foreignKey: 'studentId',
      as: 'studentFaceImages',
    });

    Student.hasOne(models.Teacher, {
      sourceKey: 'teacherId',
      foreignKey: 'id',
      as: 'teacher',
    });

    Student.hasOne(models.TrainingVehicle, {
      sourceKey: 'trainingVehicleCode',
      foreignKey: 'code',
      as: 'trainingVehicle',
    });
    Student.hasOne(models.Course, {
      sourceKey: 'courseId',
      foreignKey: 'id',
      as: 'course',
    });
  };

  Student.beforeCreate(async (student, options) => {
    try {
      let dataIndex = await sequelize.models.DataIndex.findOne({
        where: { tableName: 'Student' },
        transaction: options.transaction,
      });

      if (!dataIndex) {
        dataIndex = await sequelize.models.DataIndex.create(
          {
            tableName: 'Student',
            tableIndex: 1040,
          },
          { transaction: options.transaction },
        );
      }
      const nextId = dataIndex.tableIndex + 1;

      !student.get('id') && student.set('id', nextId);

      student.get('middleName') &&
        student.get('name') &&
        student.set(
          'fullName',
          student.get('middleName') + ' ' + student.get('name'),
        );
      student.get('createdDate') &&
        student.set('updatedDate', student.get('createdDate'));

      await dataIndex.update(
        { tableIndex: nextId },
        { transaction: options.transaction },
      );
    } catch (error) {
      console.error(
        'Error while setting student id and updating DataIndex:',
        error,
      );
      throw error;
    }
  });

  return Student;
};
