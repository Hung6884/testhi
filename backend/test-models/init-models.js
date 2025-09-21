var DataTypes = require("sequelize").DataTypes;
var _admins = require("./admins");
var _booking_services = require("./booking_services");
var _bookings = require("./bookings");
var _field_images = require("./field_images");
var _field_prices = require("./field_prices");
var _fields = require("./fields");
var _notifications = require("./notifications");
var _owner_subscriptions = require("./owner_subscriptions");
var _owners = require("./owners");
var _payments = require("./payments");
var _pendingorders = require("./pendingorders");
var _promotions = require("./promotions");
var _revenue_share = require("./revenue_share");
var _reviews = require("./reviews");
var _services = require("./services");
var _subfields = require("./subfields");
var _subscription_plans = require("./subscription_plans");
var _subscriptionpendingorders = require("./subscriptionpendingorders");
var _timeslots = require("./timeslots");
var _users = require("./users");

function initModels(sequelize) {
  var admins = _admins(sequelize, DataTypes);
  var booking_services = _booking_services(sequelize, DataTypes);
  var bookings = _bookings(sequelize, DataTypes);
  var field_images = _field_images(sequelize, DataTypes);
  var field_prices = _field_prices(sequelize, DataTypes);
  var fields = _fields(sequelize, DataTypes);
  var notifications = _notifications(sequelize, DataTypes);
  var owner_subscriptions = _owner_subscriptions(sequelize, DataTypes);
  var owners = _owners(sequelize, DataTypes);
  var payments = _payments(sequelize, DataTypes);
  var pendingorders = _pendingorders(sequelize, DataTypes);
  var promotions = _promotions(sequelize, DataTypes);
  var revenue_share = _revenue_share(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);
  var services = _services(sequelize, DataTypes);
  var subfields = _subfields(sequelize, DataTypes);
  var subscription_plans = _subscription_plans(sequelize, DataTypes);
  var subscriptionpendingorders = _subscriptionpendingorders(sequelize, DataTypes);
  var timeslots = _timeslots(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  payments.belongsTo(bookings, { as: "booking", foreignKey: "booking_id"});
  bookings.hasOne(payments, { as: "payment", foreignKey: "booking_id"});
  bookings.belongsTo(fields, { as: "field", foreignKey: "field_id"});
  fields.hasMany(bookings, { as: "bookings", foreignKey: "field_id"});
  field_images.belongsTo(fields, { as: "field", foreignKey: "field_id"});
  fields.hasMany(field_images, { as: "field_images", foreignKey: "field_id"});
  field_prices.belongsTo(fields, { as: "field", foreignKey: "field_id"});
  fields.hasMany(field_prices, { as: "field_prices", foreignKey: "field_id"});
  reviews.belongsTo(fields, { as: "field", foreignKey: "field_id"});
  fields.hasMany(reviews, { as: "reviews", foreignKey: "field_id"});
  services.belongsTo(fields, { as: "field", foreignKey: "field_id"});
  fields.hasMany(services, { as: "services", foreignKey: "field_id"});
  subfields.belongsTo(fields, { as: "field", foreignKey: "field_id"});
  fields.hasMany(subfields, { as: "subfields", foreignKey: "field_id"});
  fields.belongsTo(owners, { as: "owner", foreignKey: "owner_id"});
  owners.hasMany(fields, { as: "fields", foreignKey: "owner_id"});
  owner_subscriptions.belongsTo(owners, { as: "owner", foreignKey: "owner_id"});
  owners.hasMany(owner_subscriptions, { as: "owner_subscriptions", foreignKey: "owner_id"});
  revenue_share.belongsTo(owners, { as: "owner", foreignKey: "owner_id"});
  owners.hasMany(revenue_share, { as: "revenue_shares", foreignKey: "owner_id"});
  bookings.belongsTo(promotions, { as: "promo", foreignKey: "promo_id"});
  promotions.hasMany(bookings, { as: "bookings", foreignKey: "promo_id"});
  booking_services.belongsTo(services, { as: "service", foreignKey: "service_id"});
  services.hasMany(booking_services, { as: "booking_services", foreignKey: "service_id"});
  owner_subscriptions.belongsTo(subscription_plans, { as: "plan", foreignKey: "plan_id"});
  subscription_plans.hasMany(owner_subscriptions, { as: "owner_subscriptions", foreignKey: "plan_id"});
  subscriptionpendingorders.belongsTo(subscription_plans, { as: "plan_id_snapshot_subscription_plan", foreignKey: "plan_id_snapshot"});
  subscription_plans.hasMany(subscriptionpendingorders, { as: "subscriptionpendingorders", foreignKey: "plan_id_snapshot"});
  owner_subscriptions.belongsTo(subscriptionpendingorders, { as: "source_pending_order", foreignKey: "source_pending_order_id"});
  subscriptionpendingorders.hasOne(owner_subscriptions, { as: "owner_subscription", foreignKey: "source_pending_order_id"});
  field_prices.belongsTo(timeslots, { as: "slot", foreignKey: "slot_id"});
  timeslots.hasMany(field_prices, { as: "field_prices", foreignKey: "slot_id"});
  admins.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasOne(admins, { as: "admin", foreignKey: "user_id"});
  bookings.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(bookings, { as: "bookings", foreignKey: "user_id"});
  notifications.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(notifications, { as: "notifications", foreignKey: "user_id"});
  owners.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasOne(owners, { as: "owner", foreignKey: "user_id"});
  reviews.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(reviews, { as: "reviews", foreignKey: "user_id"});
  subscriptionpendingorders.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(subscriptionpendingorders, { as: "subscriptionpendingorders", foreignKey: "user_id"});

  return {
    admins,
    booking_services,
    bookings,
    field_images,
    field_prices,
    fields,
    notifications,
    owner_subscriptions,
    owners,
    payments,
    pendingorders,
    promotions,
    revenue_share,
    reviews,
    services,
    subfields,
    subscription_plans,
    subscriptionpendingorders,
    timeslots,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
