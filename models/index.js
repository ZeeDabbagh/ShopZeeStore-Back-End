const Category = require('./Category');
const Product = require('./Product');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag')

Product.belongsTo(Category, {
    foreignKey: 'category_id',
});

Category.hasMany(Product, {
    foreignKey: 'category_id',
    onDelete: 'CASCADE'
});

Product.belongsToMany(Tag, {
    foreignKey: 'productTag'
});

Tag.belongsToMany(Product, {
    foreignKey: 'productTag'
})

module.exports = {
    Product,
    Category,
    Tag,
    ProductTag,
  };
  
