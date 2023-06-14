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
  Category.create(req.body)
  .then((category) => {
    res.status(200).json(category)
  })
  .catch((err) => {
    res.status(400).json(err)
    console.log(err)
  })
});

router.put('/:id', (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id,
    }
  })
  .then ((updatedCategory) => {
    res.status(200).json({
      message: updatedCategory ? `You successfully updated the category` : `update wasn't successful`
    })

  })
  .catch((err) => {
    res.status(500).json(err)
    console.log(err)
  })
  
});

router.delete('/:id', (req, res) => {

  Category.destroy({where:{id: req.params.id}})

  .then((deletedCategory) => {
    if (deletedCategory === 0) {
      res.status(404).json({message: "No such category exists"})
      return
    }
    res.json({ message: "Category was successfully deleted"})
  })
  .catch((err) => {
    res.status(400).json(err)
    console.log(err)
  })
});

module.exports = router;
