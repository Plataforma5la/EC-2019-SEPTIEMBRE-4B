const S = require("sequelize");
const db = require("../config/db");

const Cart = require("./Cart");
const Review = require("./Review");

class Product extends S.Model {}

Product.init(
  {
    name: {
      type: S.STRING,
      notEmpty: true
    },
    price: {
      type: S.INTEGER,
      notEmpty: true,
      get() {
        return "$" + this.getDataValue("price");
      }
    },
    description: {
      type: S.TEXT,
      notEmpty: true
    },
    stock: {
      type: S.INTEGER,
      defaultValue: 0
    },
    image: {
      type: S.TEXT,
      notEmpty: true
    },
    category: {
      type: S.ARRAY(S.STRING)
    },
    rating: {
      type: S.INTEGER,
      defaultValue: 0 //needs to be changed for a getter or setter.
    },
    active: {
      type: S.BOOLEAN,
      set() {
        if (this.getDataValue("stock") === 0)
          this.setDataValue("active", false);
      }
    }
  },
  { sequelize: db, modelName: "product" }
);

Product.hasMany(Review);

module.exports = Product;
