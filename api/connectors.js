import config from 'config';
import path from 'path';
import Sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';


const { database, username, password, host, dialect, storage, pool } = config.get('sequelize');

const opts = { host, dialect, pool };
if (dialect === 'sqlite') {
  opts.storage = path.resolve(__dirname, storage);
}

const db = new Sequelize(database, username, password, opts);

const AuthorModel = db.define('author', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
});

const PostModel = db.define('post', {
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING },
});

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(5, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      return author.createPost({
        title: `A post by ${author.firstName}`,
        text: casual.sentences(3),
      })/*.then((post) => {
       return View.update(
       { postId: post.id },
       { views: casual.integer(0, 100) },
       { upsert: true });
       })*/;
    });
  });
});

const Author = db.models.author;
const Post = db.models.post;

class AuthorConnector {
  get(args) {
    return Author.find({ where: args });
  }
  getAll(args) {
    return Author.findAll({ where: args });
  }
}
class PostConnector {
  get(args) {
    return Post.find({ where: args });
  }
  getAll(args) {
    return Post.findAll({ where: args });
  }
}
const connectors = {
  author: AuthorConnector,
  post: PostConnector
};
export default connectors;
