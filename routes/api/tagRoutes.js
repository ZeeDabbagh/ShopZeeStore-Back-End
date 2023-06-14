const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

//get all tags
router.get('/', (req, res) => {
  Tag.findAll({
    include: [{
      model: Product
    }]
  })
  .then((tag) => res.json(tag))
  .catch((err) => res.status(500).json(err))
});

//get one tag by id
router.get('/:id', (req, res) => {
  Tag.findByPk( req.params.id, {
    include: [{
      model: Product
    }]
  })
  .then((tag) => {
    if (!tag) {
      res.status(404).json({message: 'Tag does not exist'})
    }
    res.status(200).json(tag)
  })
  .catch((err) => {
    res.status(500).json(err)
    console.log('Could not get tag', err)
  })
});

//create new tag
router.post('/', (req, res) => {
  Tag.create(req.body)
  .then((tag) => {
    res.status(200).json({message: 'Tag successfully created', tag})
  })
  .catch((err) => {
    res.status(500).json(err)
    console.log(err)
  })

});

// update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then((updatedTag) => {
    res.status(200).json({
      message: updatedTag ? `You successfully updated the tag` : `update wasn't successful`
    })
  })
  .catch((err) => {
    res.status(500).json(err);
    console.log(err)
  })
});

// delete on tag by its `id` value
router.delete('/:id', (req, res) => {

  Tag.destroy({where:{ id: req.params.id }})
  .then((deletedTag) => {
    if (deletedTag === 0) {
      res.status(404).json({message: 'No such tag exists'})
    }
    res.status(200).json({message: 'Tag was successfully deleted'})
  })
  .catch((err) => {
    res.status(500).json(err)
    console.log(err)
  })
});

module.exports = router;
