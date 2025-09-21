const logger = require('@/config/logger');
const InternalServerError = require('@/utils/response/InternalServerError');
const NotFoundError = require('@/utils/response/NotFoundError');
const ResponseDataSuccess = require('@/utils/response/ResponseDataSuccess');
const dbConnectionRepository = require('@/repositories/dbConnection.repository');
const courseRepository = require('@/repositories/course.repository');
const studentRepository = require('@/repositories/student.repository');
const teacherRepository = require('@/repositories/teacher.repository');
const trainingVehicleRepo = require('@/repositories/trainingVehicle.repository');
const { getDbSequelize } = require('@/utils/db.util');
const { isActive } = require('@/constant/mapping/course');
const { forEach, isEmpty, cloneDeep } = require('lodash');
const httpStatus = require('http-status');
const moment = require('moment');
const { fullName } = require('@/constant/mapping/administration');

const queryCourses = async () => {
  try {
    const dbConnection = await dbConnectionRepository.getDbConnection();
    if (!dbConnection) {
      return new NotFoundError('Db Connection Not found');
    }
    const sequelize = getDbSequelize(dbConnection.dataValues);
    const [record] = await sequelize.query(
      `SELECT
            kh.MaKH,
            kh.TenKH,
            kh.NgayKG,
            kh.HangDT,
            kh.MaCSDT,
            kh.NgayBG,
            kh.NgayTao,
            kh.TrangThai,
            kh.HangGPLX
        FROM KhoaHoc kh
        WHERE kh.TrangThai = 1`,
    );
    const grouped = {};

    /* const courses = await courseRepository.filterByCodes(
      record.map((course) => course.MaKH),
    ); */

    const filters = record.map((t) => ({ code: t.MaKH, csdtCode: t.MaCSDT }));
    const courses = await courseRepository.findAllByKeyPairs(filters);

    record.forEach((course) => {
      const year = new Date(course.NgayKG).getFullYear();
      const month = String(new Date(course.NgayKG).getMonth() + 1).padStart(
        2,
        '0',
      );

      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = [];

      grouped[year][month].push({
        code: course.MaKH,
        trainingCategory: course.HangDT,
        drivingLicenseCategory: course.HangGPLX,
        name: course.TenKH,
        csdtCode: course.MaCSDT,
        courseStartDate: course.NgayKG,
        courseEndDate: course.NgayBG,
        isActive: course.TrangThai == 1 ? true : false,
        createdDate: course.NgayTao,
        datCourse: courses.find((c) => c.dataValues.code === course.MaKH),
      });
    });

    return new ResponseDataSuccess(grouped);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_QUERY_COURSES', error.message);
    return new InternalServerError(error);
  }
};

const getStudentsByCourseCode = async (courseCode, csdtCode) => {
  try {
    const dbConnection = await dbConnectionRepository.getDbConnection();
    if (!dbConnection) {
      return new NotFoundError('Db Connection Not found');
    }
    const sequelize = getDbSequelize(dbConnection.dataValues);
    const [results] = await sequelize.query(
      `SELECT
            nl.MaDK AS code,
            nl.HoVaTen AS fullName,
            nl.HoDemNLX AS middleName,
            nl.TenNLX AS name,
            nl.NgaySinh AS birthday,
            nl.NoiTT AS permanentResidence,
            nl.NoiCT AS residence,
            nl.SoCMT AS nationalId,
            nl.NgayCapCMT AS nationalIdIssueDate,
            nl.MaQuocTich AS nationality,
            nl.TrangThai AS isActive,
            nl.GioiTinh AS gender,
            nh.HangGPLX AS drivingLicenseCategory,
            nh.MaKhoaHoc AS courseCode,
            nh.MaCSDT AS csdtCode,
            kh.HangDT AS trainingCategory
        FROM NguoiLX nl 
        JOIN NguoiLX_HoSo nh ON nl.MaDK = nh.MaDK
        JOIN KhoaHoc kh ON kh.MaKH = nh.MaKhoaHoc
        WHERE nh.MaKhoaHoc = :courseCode and nh.MaCSDT = :csdtCode`,
      {
        replacements: { courseCode, csdtCode },
      },
    );

    /*  const course = await courseRepository.findByCodeAndCsdtCode(
      courseCode,
      csdtCode,
    );
    if (!course) {
      return new ResponseDataSuccess(results);
    } */

    const studentCodes = results.map((r) => r.code);
    const datStudents = await studentRepository.filterByCodesAndCourse(
      studentCodes,
      courseCode,
      csdtCode,
    );

    const mapped = results.map((fpt) => {
      const matched = datStudents.find(
        (d) =>
          d.dataValues.code === fpt.code &&
          d.dataValues.csdtCode === fpt.csdtCode &&
          d.dataValues.courseCode === fpt.courseCode,
      );
      return {
        ...fpt,
        birthday: isEmpty(fpt.birthday)
          ? null
          : moment(fpt.birthday, 'YYYYMMDD').toDate(),
        isSync: !!matched, //&& matched.dataValues.isSync,
        dat: matched ? matched : {},
      };
    });

    return new ResponseDataSuccess(mapped);
  } catch (error) {
    logger.error('ERROR_OCCURRED_WHILE_GET_STUDENT_COURSES', error.message);
    return new InternalServerError(error);
  }
};

const syncCourses = async (payloads) => {
  if (isEmpty(payloads)) {
    return new InternalServerError('Không có dữ liệu đồng bộ');
  }
  try {
    const courses = [];
    let students = [];
    forEach(payloads, (data) => {
      courses.push({ ...data.course, updatedDate: new Date() });
      students = students.concat(data.students);
    });
    let upsertCourses = [];
    if (!isEmpty(courses)) {
      upsertCourses = await courseRepository.upsert(courses);
    }

    if (!isEmpty(students)) {
      if (!isEmpty(upsertCourses)) {
        forEach(students, (s) => {
          const matched = upsertCourses.find(
            (c) =>
              c.dataValues.code === s.courseCode &&
              c.dataValues.csdtCode === s.csdtCode,
          );
          if (matched) {
            s.courseId = matched.dataValues.id;
          }
        });
      }
      await studentRepository.upsert(students);
    }
  } catch (err) {
    logger.error('upsert sync courses error', err.message);
    return new InternalServerError(err);
  }
  return new ResponseDataSuccess({ status: httpStatus.OK });
};

const queryTeachers = async () => {
  try {
    const dbConnection = await dbConnectionRepository.getDbConnection();
    if (!dbConnection) {
      return new NotFoundError('Db Connection Not found');
    }
    const sequelize = getDbSequelize(dbConnection.dataValues);
    const [results] = await sequelize.query(
      `SELECT
            kh.MaGV AS code,
            kh.TenGV AS name,
            kh.HoTenDem AS middleName,
            kh.NgaySinh AS birthday,
            kh.MaCSDT AS csdtCode,
            kh.AnhCD AS avatar,
            kh.DienThoai AS phone,
            kh.SoCMT AS nationalId,
            kh.HangGPLX AS drivingLicenseCategory,
            kh.TrinhDo_VanHoa AS educationalLevelCode,
            kh.SoQD_GCN AS cndtCode,
            kh.NgayTao AS createDate,
            kh.TrangThai AS isActive
        FROM GiaoVien kh 
        WHERE kh.TrangThai = 1`,
    );
    const data = [];
    const filters = results.map((t) => ({
      code: t.code,
      csdtCode: t.csdtCode,
    }));
    const datTeachers = await teacherRepository.findAllByKeyPairs(filters);

    /* if (isEmpty(datTeachers)) {
      return new ResponseDataSuccess(results);
    } */

    results.forEach((teacher) => {
      const matched = datTeachers.find(
        (c) =>
          c.dataValues.code === teacher.code &&
          c.dataValues.csdtCode === teacher.csdtCode,
      );
      data.push({
        code: teacher.code,
        name: teacher.name,
        fullName: teacher.middleName + ' ' + teacher.name,
        middleName: teacher.middleName,
        csdtCode: teacher.csdtCode,
        cndtCode: teacher.cndtCode,
        birthday: isEmpty(teacher.birthday)
          ? null
          : moment(teacher.birthday, 'DDMMYYYY').toDate(),
        phone: teacher.phone,
        nationalId: teacher.nationalId,
        drivingLicenseCategory: teacher.drivingLicenseCategory,
        educationalLevelCode: teacher.educationalLevelCode,
        avatar: teacher.avatar,
        isActive: teacher.isActive,
        createdDate: teacher.createDate,
        isSync: !!matched,
        datTeacher: matched ? matched : null,
      });
    });

    return new ResponseDataSuccess(data);
  } catch (error) {
    logger.error('Error at query teachers', error.message);
    return new InternalServerError(error);
  }
};

const syncTeachers = async (payloads) => {
  if (isEmpty(payloads)) {
    return new InternalServerError('Không có dữ liệu đồng bộ');
  }
  try {
    const result = await teacherRepository.upsert(payloads);
    if (!result) {
      return new InternalServerError(
        'Có lỗi xảy ra khi đồng bộ dữ liệu Giáo viên',
      );
    }
  } catch (err) {
    logger.error('upsert sync teacher error', err.message);
    return new InternalServerError(err);
  }
  return new ResponseDataSuccess({ status: httpStatus.OK });
};

const queryTrainingVehicles = async () => {
  try {
    const dbConnection = await dbConnectionRepository.getDbConnection();
    if (!dbConnection) {
      return new NotFoundError('Db Connection Not found');
    }
    const sequelize = getDbSequelize(dbConnection.dataValues);
    const [results] = await sequelize.query(
      `SELECT
            kh.BienSoXe AS licensePlate,
            kh.MaCSDT AS csdtCode,
            kh.NamSX AS manufacturingYear,
            kh.NgayCapGPXTL AS licenseIssueDate,
            kh.NgayHHGPXTL AS licenseExpiryDate,
            kh.SoDK AS registrationNumber,
            kh.SoGPXTL AS licenseNumber,
            kh.CoQuanCapGPXTL AS issuingAuthority,
            kh.NgayTao AS createDate,
            kh.TrangThai AS isActive
        FROM XeTap kh
        WHERE kh.TrangThai = 1`,
    );
    const data = [];

    const filters = results.map((t) => ({
      licensePlate: t.licensePlate,
      csdtCode: t.csdtCode,
    }));
    const datTrainingVehicles =
      await trainingVehicleRepo.findAllByKeyPairs(filters);

    /*  if (isEmpty(datTrainingVehicles)) {
      return new ResponseDataSuccess(results);
    } */

    results.forEach((trainingVehicle) => {
      const matched = datTrainingVehicles.find(
        (c) =>
          c.dataValues.licensePlate === trainingVehicle.licensePlate &&
          c.dataValues.csdtCode === trainingVehicle.csdtCode,
      );
      data.push({
        code: trainingVehicle.licensePlate.replace(/[-.]/g, ''),
        licensePlate: trainingVehicle.licensePlate,
        csdtCode: trainingVehicle.csdtCode,
        manufacturingYear: trainingVehicle.manufacturingYear,
        licenseIssueDate: trainingVehicle.licenseIssueDate,

        licenseExpiryDate: trainingVehicle.licenseExpiryDate,
        registrationNumber: trainingVehicle.registrationNumber,
        licenseNumber: trainingVehicle.licenseNumber,
        issuingAuthority: trainingVehicle.issuingAuthority,
        drivingLicenseCategory: trainingVehicle.drivingLicenseCategory || null,
        isActive: trainingVehicle.isActive,
        //createdDate: trainingVehicle.createDate,
        isSync: !!matched,
        datTrainingVehicle: matched ? matched : null,
      });
    });

    return new ResponseDataSuccess(data);
  } catch (error) {
    logger.error('Error at query training vehicles', error.message);
    return new InternalServerError(error);
  }
};

const syncTrainingVehicles = async (payloads) => {
  if (isEmpty(payloads)) {
    return new InternalServerError('Không có dữ liệu đồng bộ');
  }
  try {
    const result = await trainingVehicleRepo.upsert(payloads);
    if (!result) {
      return new InternalServerError(
        'Có lỗi xảy ra khi đồng bộ dữ liệu Xe tập lái',
      );
    }
  } catch (err) {
    logger.error('upsert sync training vehicle error', err.message);
    return new InternalServerError(err);
  }
  return new ResponseDataSuccess({ status: httpStatus.OK });
};

module.exports = {
  queryCourses,
  getStudentsByCourseCode,
  syncCourses,
  queryTeachers,
  syncTeachers,
  queryTrainingVehicles,
  syncTrainingVehicles,
};
