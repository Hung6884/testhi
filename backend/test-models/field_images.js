const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('field_images', {
    image_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    field_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fields',
        key: 'field_id'
      }
    },
    image_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Tên file ảnh (ví dụ: field_image_1.jpg)"
    },
    image_type: {
      type: DataTypes.ENUM('main','sub'),
      allowNull: true,
      defaultValue: "main",
      comment: "Loại ảnh: ảnh chính (main) hoặc ảnh phụ (sub)"
    },
    upload_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'field_images',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_id" },
        ]
      },
      {
        name: "field_id",
        using: "BTREE",
        fields: [
          { name: "field_id" },
        ]
      },
    ]
  });
};
