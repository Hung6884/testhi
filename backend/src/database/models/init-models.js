var DataTypes = require("sequelize").DataTypes;
var _commerce_fabric_exports = require("./commerce_fabric_exports");
var _commerce_fabric_payments = require("./commerce_fabric_payments");
var _commerce_fabric_transaction_details = require("./commerce_fabric_transaction_details");
var _commerce_fabric_transaction_details_info = require("./commerce_fabric_transaction_details_info");
var _commerce_fabric_transactions = require("./commerce_fabric_transactions");
var _commerce_fabrics = require("./commerce_fabrics");
var _customers = require("./customers");
var _metadata = require("./metadata");
var _payment_order_directly_history = require("./payment_order_directly_history");
var _payment_order_history = require("./payment_order_history");
var _payment_order_pet_history = require("./payment_order_pet_history");
var _production_order_pets = require("./production_order_pets");
var _production_orders = require("./production_orders");
var _production_orders_directly = require("./production_orders_directly");
var _receipt_outside = require("./receipt_outside");
var _revenue_expenditure_history = require("./revenue_expenditure_history");
var _users = require("./users");

function initModels(sequelize) {
  var commerce_fabric_exports = _commerce_fabric_exports(sequelize, DataTypes);
  var commerce_fabric_payments = _commerce_fabric_payments(sequelize, DataTypes);
  var commerce_fabric_transaction_details = _commerce_fabric_transaction_details(sequelize, DataTypes);
  var commerce_fabric_transaction_details_info = _commerce_fabric_transaction_details_info(sequelize, DataTypes);
  var commerce_fabric_transactions = _commerce_fabric_transactions(sequelize, DataTypes);
  var commerce_fabrics = _commerce_fabrics(sequelize, DataTypes);
  var customers = _customers(sequelize, DataTypes);
  var metadata = _metadata(sequelize, DataTypes);
  var payment_order_directly_history = _payment_order_directly_history(sequelize, DataTypes);
  var payment_order_history = _payment_order_history(sequelize, DataTypes);
  var payment_order_pet_history = _payment_order_pet_history(sequelize, DataTypes);
  var production_order_pets = _production_order_pets(sequelize, DataTypes);
  var production_orders = _production_orders(sequelize, DataTypes);
  var production_orders_directly = _production_orders_directly(sequelize, DataTypes);
  var receipt_outside = _receipt_outside(sequelize, DataTypes);
  var revenue_expenditure_history = _revenue_expenditure_history(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  customers.belongsTo(users, { as: "direct_color_tester_user", foreignKey: "direct_color_tester"});
  users.hasMany(customers, { as: "direct_color_tester_customers", foreignKey: "direct_color_tester"});
  commerce_fabric_transaction_details.belongsTo(commerce_fabric_transactions, { as: "commerce_fabric_transaction", foreignKey: "commerce_fabric_transaction_id"});
  commerce_fabric_transactions.hasMany(commerce_fabric_transaction_details, { as: "commerce_fabric_transaction_details", foreignKey: "commerce_fabric_transaction_id"});
  commerce_fabric_transaction_details_info.belongsTo(commerce_fabric_transactions, { as: "commerce_fabric_transaction", foreignKey: "commerce_fabric_transaction_id"});
  commerce_fabric_transactions.hasMany(commerce_fabric_transaction_details_info, { as: "commerce_fabric_transaction_details_infos", foreignKey: "commerce_fabric_transaction_id"});
  commerce_fabric_exports.belongsTo(commerce_fabrics, { as: "fabric", foreignKey: "fabric_id"});
  commerce_fabrics.hasMany(commerce_fabric_exports, { as: "commerce_fabric_exports", foreignKey: "fabric_id"});
  commerce_fabric_transaction_details.belongsTo(commerce_fabrics, { as: "commerce_fabric", foreignKey: "commerce_fabric_id"});
  commerce_fabrics.hasMany(commerce_fabric_transaction_details, { as: "commerce_fabric_transaction_details", foreignKey: "commerce_fabric_id"});
  commerce_fabric_exports.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(commerce_fabric_exports, { as: "commerce_fabric_exports", foreignKey: "customer_id"});
  commerce_fabric_payments.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(commerce_fabric_payments, { as: "commerce_fabric_payments", foreignKey: "customer_id"});
  commerce_fabric_transactions.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(commerce_fabric_transactions, { as: "commerce_fabric_transactions", foreignKey: "customer_id"});
  payment_order_directly_history.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(payment_order_directly_history, { as: "payment_order_directly_histories", foreignKey: "customer_id"});
  payment_order_history.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(payment_order_history, { as: "payment_order_histories", foreignKey: "customer_id"});
  payment_order_pet_history.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(payment_order_pet_history, { as: "payment_order_pet_histories", foreignKey: "customer_id"});
  production_order_pets.belongsTo(customers, { as: "customer_customer", foreignKey: "customer"});
  customers.hasMany(production_order_pets, { as: "production_order_pets", foreignKey: "customer"});
  production_orders.belongsTo(customers, { as: "customer_customer", foreignKey: "customer"});
  customers.hasMany(production_orders, { as: "production_orders", foreignKey: "customer"});
  production_orders_directly.belongsTo(customers, { as: "customer_customer", foreignKey: "customer"});
  customers.hasMany(production_orders_directly, { as: "production_orders_directlies", foreignKey: "customer"});
  receipt_outside.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(receipt_outside, { as: "receipt_outsides", foreignKey: "customer_id"});
  revenue_expenditure_history.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(revenue_expenditure_history, { as: "revenue_expenditure_histories", foreignKey: "customer_id"});
  production_order_pets.belongsTo(drawing_patten, { as: "pattern", foreignKey: "pattern_id"});
  drawing_patten.hasMany(production_order_pets, { as: "production_order_pets", foreignKey: "pattern_id"});
  production_orders.belongsTo(drawing_patten, { as: "pattern", foreignKey: "pattern_id"});
  drawing_patten.hasMany(production_orders, { as: "production_orders", foreignKey: "pattern_id"});
  production_orders_directly.belongsTo(drawing_patten, { as: "pattern", foreignKey: "pattern_id"});
  drawing_patten.hasMany(production_orders_directly, { as: "production_orders_directlies", foreignKey: "pattern_id"});
  production_order_pets.belongsTo(machines, { as: "printer_machine", foreignKey: "printer"});
  machines.hasMany(production_order_pets, { as: "production_order_pets", foreignKey: "printer"});
  production_order_pets.belongsTo(machines, { as: "extracter_machine", foreignKey: "extracter"});
  machines.hasMany(production_order_pets, { as: "extracter_production_order_pets", foreignKey: "extracter"});
  production_orders.belongsTo(machines, { as: "printer_machine", foreignKey: "printer"});
  machines.hasMany(production_orders, { as: "production_orders", foreignKey: "printer"});
  production_orders.belongsTo(machines, { as: "extracter_machine", foreignKey: "extracter"});
  machines.hasMany(production_orders, { as: "extracter_production_orders", foreignKey: "extracter"});
  production_orders.belongsTo(machines, { as: "billet_printer_machine", foreignKey: "billet_printer"});
  machines.hasMany(production_orders, { as: "billet_printer_production_orders", foreignKey: "billet_printer"});
  production_orders_directly.belongsTo(machines, { as: "sizing_device_machine", foreignKey: "sizing_device"});
  machines.hasMany(production_orders_directly, { as: "production_orders_directlies", foreignKey: "sizing_device"});
  production_orders_directly.belongsTo(machines, { as: "printer_machine", foreignKey: "printer"});
  machines.hasMany(production_orders_directly, { as: "printer_production_orders_directlies", foreignKey: "printer"});
  production_orders_directly.belongsTo(machines, { as: "extracter_machine", foreignKey: "extracter"});
  machines.hasMany(production_orders_directly, { as: "extracter_production_orders_directlies", foreignKey: "extracter"});
  production_orders_directly.belongsTo(machines, { as: "billet_printer_machine", foreignKey: "billet_printer"});
  machines.hasMany(production_orders_directly, { as: "billet_printer_production_orders_directlies", foreignKey: "billet_printer"});
  commerce_fabric_transaction_details_info.belongsTo(metadata, { as: "fabric", foreignKey: "fabric_id"});
  metadata.hasMany(commerce_fabric_transaction_details_info, { as: "commerce_fabric_transaction_details_infos", foreignKey: "fabric_id"});
  commerce_fabric_transactions.belongsTo(metadata, { as: "fabric_type_metadatum", foreignKey: "fabric_type"});
  metadata.hasMany(commerce_fabric_transactions, { as: "commerce_fabric_transactions", foreignKey: "fabric_type"});
  commerce_fabrics.belongsTo(metadata, { as: "fabric_type_metadatum", foreignKey: "fabric_type"});
  metadata.hasMany(commerce_fabrics, { as: "commerce_fabrics", foreignKey: "fabric_type"});
  commerce_fabric_exports.belongsTo(production_order_pets, { as: "order_pet", foreignKey: "order_pet_id"});
  production_order_pets.hasMany(commerce_fabric_exports, { as: "commerce_fabric_exports", foreignKey: "order_pet_id"});
  payment_order_pet_history.belongsTo(production_order_pets, { as: "pet", foreignKey: "pet_id"});
  production_order_pets.hasMany(payment_order_pet_history, { as: "payment_order_pet_histories", foreignKey: "pet_id"});
  commerce_fabric_exports.belongsTo(production_orders, { as: "order", foreignKey: "order_id"});
  production_orders.hasMany(commerce_fabric_exports, { as: "commerce_fabric_exports", foreignKey: "order_id"});
  payment_order_history.belongsTo(production_orders, { as: "order", foreignKey: "order_id"});
  production_orders.hasMany(payment_order_history, { as: "payment_order_histories", foreignKey: "order_id"});
  payment_order_directly_history.belongsTo(production_orders_directly, { as: "direct_order", foreignKey: "direct_order_id"});
  production_orders_directly.hasMany(payment_order_directly_history, { as: "payment_order_directly_histories", foreignKey: "direct_order_id"});
  payment_order_directly_history.belongsTo(receipt_outside, { as: "receipt", foreignKey: "receipt_id"});
  receipt_outside.hasMany(payment_order_directly_history, { as: "payment_order_directly_histories", foreignKey: "receipt_id"});
  payment_order_history.belongsTo(receipt_outside, { as: "receipt", foreignKey: "receipt_id"});
  receipt_outside.hasMany(payment_order_history, { as: "payment_order_histories", foreignKey: "receipt_id"});
  payment_order_pet_history.belongsTo(receipt_outside, { as: "receipt", foreignKey: "receipt_id"});
  receipt_outside.hasMany(payment_order_pet_history, { as: "payment_order_pet_histories", foreignKey: "receipt_id"});
  payment_order_directly_history.belongsTo(revenue_expenditure_history, { as: "revenue", foreignKey: "revenue_id"});
  revenue_expenditure_history.hasMany(payment_order_directly_history, { as: "payment_order_directly_histories", foreignKey: "revenue_id"});
  payment_order_history.belongsTo(revenue_expenditure_history, { as: "revenue", foreignKey: "revenue_id"});
  revenue_expenditure_history.hasMany(payment_order_history, { as: "payment_order_histories", foreignKey: "revenue_id"});
  payment_order_pet_history.belongsTo(revenue_expenditure_history, { as: "revenue", foreignKey: "revenue_id"});
  revenue_expenditure_history.hasMany(payment_order_pet_history, { as: "payment_order_pet_histories", foreignKey: "revenue_id"});
  revenue_expenditure_history.belongsTo(suppliers, { as: "supplier", foreignKey: "supplier_id"});
  suppliers.hasMany(revenue_expenditure_history, { as: "revenue_expenditure_histories", foreignKey: "supplier_id"});
  commerce_fabric_exports.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(commerce_fabric_exports, { as: "commerce_fabric_exports", foreignKey: "created_by"});
  commerce_fabric_exports.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by"});
  users.hasMany(commerce_fabric_exports, { as: "updated_by_commerce_fabric_exports", foreignKey: "updated_by"});
  commerce_fabric_payments.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(commerce_fabric_payments, { as: "commerce_fabric_payments", foreignKey: "created_by"});
  commerce_fabric_payments.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by"});
  users.hasMany(commerce_fabric_payments, { as: "updated_by_commerce_fabric_payments", foreignKey: "updated_by"});
  commerce_fabric_transaction_details.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(commerce_fabric_transaction_details, { as: "commerce_fabric_transaction_details", foreignKey: "created_by"});
  commerce_fabric_transaction_details.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by"});
  users.hasMany(commerce_fabric_transaction_details, { as: "updated_by_commerce_fabric_transaction_details", foreignKey: "updated_by"});
  commerce_fabric_transaction_details_info.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(commerce_fabric_transaction_details_info, { as: "commerce_fabric_transaction_details_infos", foreignKey: "created_by"});
  commerce_fabric_transaction_details_info.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by"});
  users.hasMany(commerce_fabric_transaction_details_info, { as: "updated_by_commerce_fabric_transaction_details_infos", foreignKey: "updated_by"});
  commerce_fabric_transactions.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(commerce_fabric_transactions, { as: "commerce_fabric_transactions", foreignKey: "created_by"});
  commerce_fabric_transactions.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by"});
  users.hasMany(commerce_fabric_transactions, { as: "updated_by_commerce_fabric_transactions", foreignKey: "updated_by"});
  commerce_fabrics.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(commerce_fabrics, { as: "commerce_fabrics", foreignKey: "created_by"});
  commerce_fabrics.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by"});
  users.hasMany(commerce_fabrics, { as: "updated_by_commerce_fabrics", foreignKey: "updated_by"});
  customers.belongsTo(users, { as: "color_tester_user", foreignKey: "color_tester"});
  users.hasMany(customers, { as: "customers", foreignKey: "color_tester"});
  customers.belongsTo(users, { as: "direct_color_tester_v2_user", foreignKey: "direct_color_tester_v2"});
  users.hasMany(customers, { as: "direct_color_tester_v2_customers", foreignKey: "direct_color_tester_v2"});
  customers.belongsTo(users, { as: "saler_user", foreignKey: "saler"});
  users.hasMany(customers, { as: "saler_customers", foreignKey: "saler"});
  production_order_pets.belongsTo(users, { as: "painter_user", foreignKey: "painter"});
  users.hasMany(production_order_pets, { as: "production_order_pets", foreignKey: "painter"});
  production_order_pets.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(production_order_pets, { as: "created_by_production_order_pets", foreignKey: "created_by"});
  production_order_pets.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by"});
  users.hasMany(production_order_pets, { as: "updated_by_production_order_pets", foreignKey: "updated_by"});
  production_order_pets.belongsTo(users, { as: "printor_user", foreignKey: "printor"});
  users.hasMany(production_order_pets, { as: "printor_production_order_pets", foreignKey: "printor"});
  production_order_pets.belongsTo(users, { as: "extractor_user", foreignKey: "extractor"});
  users.hasMany(production_order_pets, { as: "extractor_production_order_pets", foreignKey: "extractor"});
  production_order_pets.belongsTo(users, { as: "deliver_user", foreignKey: "deliver"});
  users.hasMany(production_order_pets, { as: "deliver_production_order_pets", foreignKey: "deliver"});
  production_order_pets.belongsTo(users, { as: "cuttor_user", foreignKey: "cuttor"});
  users.hasMany(production_order_pets, { as: "cuttor_production_order_pets", foreignKey: "cuttor"});
  production_orders.belongsTo(users, { as: "painter_user", foreignKey: "painter"});
  users.hasMany(production_orders, { as: "production_orders", foreignKey: "painter"});
  production_orders.belongsTo(users, { as: "saler_user", foreignKey: "saler"});
  users.hasMany(production_orders, { as: "saler_production_orders", foreignKey: "saler"});
  production_orders.belongsTo(users, { as: "color_tester_user", foreignKey: "color_tester"});
  users.hasMany(production_orders, { as: "color_tester_production_orders", foreignKey: "color_tester"});
  production_orders.belongsTo(users, { as: "printor_user", foreignKey: "printor"});
  users.hasMany(production_orders, { as: "printor_production_orders", foreignKey: "printor"});
  production_orders_directly.belongsTo(users, { as: "painter_user", foreignKey: "painter"});
  users.hasMany(production_orders_directly, { as: "production_orders_directlies", foreignKey: "painter"});
  production_orders_directly.belongsTo(users, { as: "saler_user", foreignKey: "saler"});
  users.hasMany(production_orders_directly, { as: "saler_production_orders_directlies", foreignKey: "saler"});
  production_orders_directly.belongsTo(users, { as: "color_tester_user", foreignKey: "color_tester"});
  users.hasMany(production_orders_directly, { as: "color_tester_production_orders_directlies", foreignKey: "color_tester"});
  production_orders_directly.belongsTo(users, { as: "printor_user", foreignKey: "printor"});
  users.hasMany(production_orders_directly, { as: "printor_production_orders_directlies", foreignKey: "printor"});
  receipt_outside.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(receipt_outside, { as: "receipt_outsides", foreignKey: "created_by"});
  receipt_outside.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by"});
  users.hasMany(receipt_outside, { as: "updated_by_receipt_outsides", foreignKey: "updated_by"});
  revenue_expenditure_history.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(revenue_expenditure_history, { as: "revenue_expenditure_histories", foreignKey: "created_by"});

  return {
    commerce_fabric_exports,
    commerce_fabric_payments,
    commerce_fabric_transaction_details,
    commerce_fabric_transaction_details_info,
    commerce_fabric_transactions,
    commerce_fabrics,
    customers,
    metadata,
    payment_order_directly_history,
    payment_order_history,
    payment_order_pet_history,
    production_order_pets,
    production_orders,
    production_orders_directly,
    receipt_outside,
    revenue_expenditure_history,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
