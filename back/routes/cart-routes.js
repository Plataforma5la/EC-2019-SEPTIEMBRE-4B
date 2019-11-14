const express = require("express");
const Product_Cart = require("sequelize");
const router = express.Router();
const { Cart, Product, User, Product_cart } = require("../models");

router.post("/remove", async function(req, res, next) {
  const cart = await Cart.findOne({
    where: { CurrentUserCartId: req.user.id }
  });

  await Product_cart.destroy({
    where: { cartId: cart.id, productId: req.body.id }
  });

  const prodIdsIncart = await Product_cart.findAll({
    where: { cartId: cart.id }
  });

  const frontCart = prodIdsIncart.map(async productCartId => {
    let product = await Product.findByPk(productCartId.productId);
    product.dataValues.quantity = productCartId.dataValues.quantity;

    return product.dataValues;
  });
  let culo = await Promise.all(frontCart);

  res.send(culo);
});

router.post("/", async function(req, res, next) {
  const cart = await Cart.findOne({
    where: { CurrentUserCartId: req.user.id }
  });

  await cart.addProduct(req.body.id);

  const product_cart = await Product_cart.findOne({
    where: { cartId: cart.id, productId: req.body.id }
  });

  await product_cart.update({ quantity: product_cart.quantity + 1 });

  const array = await Product_cart.findAll({ where: { cartId: cart.id } });

  let getFrontCart = array.map(async product => {
    let frontProduct = await Product.findByPk(product.dataValues.productId);
    frontProduct.dataValues.quantity = product.dataValues.quantity;
    return frontProduct.dataValues;
  });

  const frontCart = await Promise.all(getFrontCart);
  res.send(frontCart);
});

router.post("/addQuantity/", function(req, res) {
  Cart.findOne({
    where: { CurrentUserCartId: req.user.id },
    include: [{ model: Product }]
  }).then(cart => {
    console.log(cart, ".-----------cart");
    let foundProduct = cart.products.find(product => {
      console.log(product, "---------");
      return product.dataValues.id === req.body.id;
    });
    
    Product.findOne({where: {id : req.body.id}, include: [{all: true}]
    }).then(product=>{
      console.log("---------111111",product)
      cart.hasProduct(product).then(productExists => {
        if (productExists) {
          foundProduct.product_cart
            .update({ quantity: foundProduct.product_cart.quantity + 1 })
            .then(() => {
              Cart.findOne({
                where: { CurrentUserCartId: req.user.id },
                include: [{ model: Product }]
              }).then(cart => {
                cart.products.forEach(product => {
                  product.dataValues.quantity = product.product_cart.quantity;
                });
                res.send(cart.products);
              });
            });
        } else {
          console.log("----------entro___---------------")
          cart.addProduct(product).then(cart2 => {
            console.log("CART!!!!", cart2)
            Cart.findOne({
              where: { CurrentUserCartId: req.user.id },
              include: [{ model: Product }]
            }).then(cart => {
              console.log(cart, "----------------");
              res.send(cart.products);
            });
          });
        }
      });
    })
  });
});

router.post("/subtractQuantity/", function(req, res) {
  Cart.findOne({
    where: { CurrentUserCartId: req.user.id },
    include: [{ model: Product }]
  }).then(cart => {
    let foundProduct = cart.products.find(product => {
      return product.dataValues.id === req.body.id;
    });
    foundProduct.product_cart
      .update({ quantity: foundProduct.product_cart.quantity - 1 })
      .then(() => {
        Cart.findOne({
          where: { CurrentUserCartId: req.user.id },
          include: [{ model: Product }]
        }).then(cart => {
          cart.products.forEach(product => {
            product.dataValues.quantity = product.product_cart.quantity;
          });

          res.send(cart.products);
        });
      });
  });
});

router.get("/me", function(req, res, next) {
  Cart.findOne({
    where: { CurrentUserCartId: req.user.id },
    include: [{ model: Product }]
  }).then(cart => {
    cart.products.forEach(product => {
      product.dataValues.quantity = product.product_cart.quantity;
    });

    res.send(cart.products);
  });
});

//move current cart to history

module.exports = router;
