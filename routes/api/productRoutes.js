const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


// get all products
router.get('/', (req, res) => {
  Product.findAll({
    include: [{
      model: Category,
      model: Tag
    }]
  })
  .then((product) => {
    res.json(product)
  })
  .catch((err) => {
    res.status(500).json(err);
    console.log(err)
  })
});

// get one product
router.get('/:id', (req, res) => {
  const productID = req.params.id

  Product.findByPk(productID, {
    include: [{
      model: Category,
      model: Tag
    }]
  })
  .then((product) => {
    if (!product) {
      res.status(404).json({ message: 'No product found with this id'})
    }
      res.json(product)
  })
  .catch((err) => {
    res.status(500).json(err)
    console.log(err)
  })
});

// create new product
router.post('/', (req, res) => {

  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds

        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

  // delete one product by its `id` value
router.delete('/:id', (req, res) => {
  Product.destroy({ where: { id: req.params.id } })
  .then((deletedProduct) => {
    if (deletedProduct === 0) {
      res.status(404).json({message: 'No such product exists'})
    }
    res.json({message: 'Product was successfully deleted'})
  })
  .catch((err) => {
    res.status(500).json(err)
  })
});

module.exports = router;
