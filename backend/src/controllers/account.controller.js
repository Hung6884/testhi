const httpStatus = require('http-status');
const pick = require('lodash/pick');
const get = require('lodash/get');
// const { accountService } = require('../services/index');
// const { convertQuerySortToObject } = require('../../../utils/query.util');

const activeById = async (req, res) => {
  return res.status(httpStatus.OK);
};

const search = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const filters = pick(req.query, ['accountname', 'email', 'isActive']);
  //   const sorts = convertQuerySortToObject(get(req.query, ['sorts'], ''));
  //   const options = pick(req.query, ['per', 'page']);

  //   const data = await accountService.search({
  //     options,
  //     filters,
  //     sorts,
  //   });
  //   if (data.status === httpStatus.OK) {
  //     return res.status(httpStatus.OK).send(data.data);
  //   }
  //   return res.status(data.status).send({
  //     message: data.message,
  //   });
};

const findById = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const data = await accountService.findById(req.params.id);
  //   if (data.status === httpStatus.OK) {
  //     return res.status(httpStatus.OK).send(data.data);
  //   }
  //   return res.status(data.status).send({
  //     message: data.message,
  //   });
};

const getAccountApprovalUnlock = async (req, res) => {
  return res.status(httpStatus.OK);
};

const updatePersonalInfo = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const data = await accountService.updatePersonalInfo(req.body);
  //   if (data.status === httpStatus.OK) {
  //     return res.status(httpStatus.OK).send(data.data);
  //   }
  //   return res.status(data.status).send({
  //     message: data.message,
  //   });
};

const updateById = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const { id } = req.params;
  //   const updateData = req.body;

  //   try {
  //     const result = await accountService.updateAccountAndRoles(id, updateData);

  //     return res
  //       .status(result.status)
  //       .json(
  //         result.error
  //           ? { error: result.error }
  //           : { message: 'Account updated successfully', data: result.data },
  //       );
  //   } catch (error) {
  //     console.error('Error updating account:', error);
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }
};

const updateRolesById = async (req, res) => {
  return res.status(httpStatus.OK);
};

const deleteById = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const data = await accountService.deleteById(req.params.id);
  //   if (data.status === httpStatus.OK) {
  //     return res.status(httpStatus.OK).send(data.data);
  //   }
  //   return res.status(data.status).send({
  //     message: data.message,
  //   });
};

const findRoleAndPermissionById = async (req, res) => {
  return res.status(httpStatus.OK);
};

const findPersonalInfo = async (req, res) => {
  return res.status(httpStatus.OK);
};

const getCurrentAccount = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const { accountId } = req.headers;
  //   const token = req.headers.authorization.split(' ')[1];

  //   const data = await accountService.getCurrentAccount(token, accountId);
  //   if (data.status === httpStatus.OK) {
  //     return res.status(httpStatus.OK).send(data.data);
  //   }
  //   return res.status(data.status).send({
  //     message: data.message,
  //   });
};

const getPermissionsByEmail = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   const email = get(req, 'headers.email', null);
  //   if (!email) {
  //     return res.status(400).json({ error: 'Email is required' });
  //   }

  //   const { moduleName } = req.body;
  //   try {
  //     const permissions = await accountService.getPermissionsByEmail(
  //       email,
  //       moduleName,
  //     );
  //     if (!permissions) {
  //       return res.status(400).json({ error: 'Account not found!' });
  //     }
  //     return res.status(200).json({ permissions });
  //   } catch (error) {
  //     console.error('Error fetching permissions:', error);
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }
};

const createAccount = async (req, res) => {
  return res.status(httpStatus.OK).send();
  //   try {
  //     const accountData = req.body;
  //     accountData.isActive = true;
  //     const data = await accountService.register(accountData);

  //     if (data.status === 200) {
  //       return res.status(200).send(data.data);
  //     }

  //     return res.status(data.status).send({
  //       message: data.message,
  //     });
  //   } catch (error) {
  //     console.error('Error creating account:', error);
  //     return res.status(400).send({
  //       message: 'Internal server error while creating account',
  //     });
  //   }
};

module.exports = {
  activeById,
  findById,
  getAccountApprovalUnlock,
  search,
  updateById,
  deleteById,
  updateRolesById,
  findRoleAndPermissionById,
  findPersonalInfo,
  updatePersonalInfo,
  getCurrentAccount,
  getPermissionsByEmail,
  createAccount,
};
