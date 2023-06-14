const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', (req, res) => {
  Category.findAll({
    include: [{
      model: Product,
    }],
  })
  .then((category) => {
    res.json(category)
  })
  .catch((err) => {
    res.errored(err);
    res.status(500).json(err);
  })
});

router.get('/:id', (req, res) => {
  const categoryID = req.params.id

  Category.findByPk(categoryID, {
    include: [{
      model: Product
    }]
  })
  .then((category) => {
    if (!category) {
      res.status(404).json({message: "Category doesn't exist"})
      return;
    }
    res.json(category)
  })
  .catch((err) => {
    console.log("Error getting single product", err);
    res.status(500).json(err);
  })
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
