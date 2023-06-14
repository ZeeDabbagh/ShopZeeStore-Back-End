const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll({
    include: [{
      model: Product
    }]
  })
  .then((tag) => res.json(tag))
  .catch((err) => res.status(500).json(err))
});


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

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
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

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
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
