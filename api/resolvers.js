/*
 Not every field needs a resolve function. In the example above, Author.firstName doesn’t have a
 resolve function, because the value is already on the Author object that the RootQuery.author
 resolve function returned. If the schema doesn’t define a resolve function for a field, the server
 will try to apply the default resolve function, which looks for the property on the input value 
 that has the same name as the field.

 As a general rule of thumb, resolve functions should only use connectors and not depend on any
 external libraries. They should be kept as simple as possible, and any complicated logic should be
 moved into a connector, which is why the resolve functions on their own will not do anything
 without the corresponding connectors.
 */
import { Author } from './connectors';

const resolvers = {
  Query: {
    author(_, args, ctx) {
      return ctx.connectors.author.get(args);
    },
    authors(_, args, ctx) {
      return ctx.connectors.author.getAll(args);
    }
  },
  Mutation: {
    createAuthor: (root, args) => {
      return Author.create(args);
    },
    createPost: (root, { authorId, tags, title, text }) => {
      return Author.findOne({ where: { id: authorId } }).then((author) => {
        return author.createPost({ tags: tags.join(','), title, text });
      });
    },
  },
  Author: {
    posts(author) {
      return author.getPosts();
    },
  },
  Post: {
    author(post) {
      return post.getAuthor();
    },
  },
};

export default resolvers;