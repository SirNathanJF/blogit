const User = require('./User');
const BlogPost = require('./BlogPost');
const Comment = require('./Comment');

User.hasMany(BlogPost, {
  foreignKey: 'author_id',
  onDelete: 'CASCADE'
});

User.hasMany(Comment, {
  foreignKey: 'commentor_id',
  onDelete: 'CASCADE'
});

BlogPost.belongsTo(User, {
  foreignKey: 'author_id'
});

BlogPost.hasMany(Comment, {
  foreignKey: 'entry_id',
  onDelete: 'CASCADE'
});

Comment.belongsTo(BlogPost, {
  foreignKey: 'entry_id'
});

Comment.belongsTo(User, {
  foreignKey: 'commentor_id'
});

module.exports = { User, Comment, BlogPost };