// const mapValues = require('lodash/mapValues');
const Sequelize = require('sequelize');
const {
  models: { Account },
} = require('../database/index');
const sq = require('../database/index');
// const helper = require('../../../utils/helper');

// const { Op } = Sequelize;

// const search = async ({ page, per, filters = {}, sorts = [] }) => {
//   const { limit, offset } = helper.paginate(page, per);
//   return await User.findAndCountAll({
//     offset,
//     limit,
//     where: {
//       deleted_time: null,
//       ...mapValues(
//         filters,
//         (value) => {
//           return {
//             [Op.iLike]: `%${value}%`,
//           };
//         },
//         {},
//       ),
//     },
//     attributes: [
//       'id',
//       'username',
//       'email',
//       'isActive',
//       'createdTime',
//       'lastLogin',
//     ],
//     order: [...sorts],
//     include: [
//       {
//         model: Role,
//         attributes: ['id', 'roleCode', 'roleDescriptionCode'],
//         as: 'roles',
//         through: {
//           attributes: [],
//         },
//       },
//     ],
//   });
// };

// const findByEmail = async (email) => {
//   const user = await User.findOne({
//     where: {
//       email: Sequelize.where(
//         Sequelize.fn('LOWER', Sequelize.col('email')),
//         Sequelize.Op.eq,
//         email.toLowerCase(),
//       ),
//       isActive: true,
//     },
//   });
//   return user;
// };

const findByUserName = async (username) => {
  try {
    const account = await Account.findOne({
      where: {
        accountName: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('account_name')),
          Sequelize.Op.eq,
          username.toLowerCase(),
        ),
      },
      raw: true,
    });
    return account;
  } catch (e) {
    console.log(e);
    return null;
  }
};
// const findById = async (id, options = {}) => {
//   return await User.findOne({
//     where: {
//       id,
//       deletedTime: null,
//     },
//     attributes: ['id', 'email', 'username', 'isActive', 'lastLogin', 'email'],
//     ...options,
//   });
// };

// const findByUsername = async (username, options = {}) => {
//   return await User.findOne({
//     where: {
//       username: Sequelize.where(
//         Sequelize.fn('LOWER', Sequelize.col('username')),
//         Sequelize.Op.eq,
//         username.toLowerCase(),
//       ),
//       deletedTime: null,
//     },
//     attributes: [
//       'id',
//       'email',
//       'username',
//       'isActive',
//       'lastLogin',
//       'email',
//       'employeeId',
//     ],
//     ...options,
//   });
// };

// const findPasswordById = async (id, isAdminEvent = false) => {
//   const options = {
//     id,
//     isActive: true,
//   };
//   if (isAdminEvent) {
//     delete options.isActive;
//   }
//   return User.findOne({
//     where: options,
//     attributes: ['password', 'username'],
//     raw: true,
//   });
// };

// const findByIds = async (ids) => {
//   return User.findAll({
//     where: {
//       id: {
//         [Sequelize.Op.in]: ids,
//       },
//     },
//     attributes: ['id', 'email', 'username', 'is_active', 'last_login'],
//     raw: true,
//   });
// };

// const findByAccounts = async (accounts) => {
//   return User.findAll({
//     where: {
//       username: {
//         [Sequelize.Op.in]: accounts,
//       },
//     },
//     raw: true,
//   });
// };

// const findAll = async (whereQuery, options) => {
//   return await User.findAll();
// };

// const create = async (body) => {
//   return await User.create(body);
// };

// const activeById = async (id, body) => {
//   return await User.update(body, {
//     where: {
//       id,
//       isActive: true,
//     },
//   });
// };

// const updateLastLogin = async (id) => {
//   return await User.update(
//     {
//       last_login: helper.getCurrentTime(),
//     },
//     {
//       where: {
//         id,
//         isActive: true,
//       },
//     },
//   );
// };

// const updateById = async (id, body) => {
//   return await User.update(body, {
//     where: {
//       id,
//       // isActive: true,
//     },
//   });
// };

// const deleteById = async (id, body) => {
//   return await User.update(body, {
//     where: {
//       id,
//       isActive: true,
//     },
//   });
// };

// const destroyById = async (id) => {
//   return await User.destroy({ where: { id } });
// };

// const updateUserDeleted = async (id, body) => {
//   return await User.update(body, {
//     where: {
//       id,
//     },
//   });
// };

module.exports = {
  //   search,
  //   findByEmail,
  findByUserName,
  //   findByUsername,
  //   create,
  //   findById,
  //   findByIds,
  //   findAll,
  //   findByAccounts,
  //   activeById,
  //   deleteById,
  //   updateLastLogin,
  //   updateById,
  //   findPasswordById,
  //   updateUserDeleted,
  //   destroyById,
};
