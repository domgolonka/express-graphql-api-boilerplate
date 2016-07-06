const casual = require('casual');
const _ = require('lodash');
const uuid = require('uuid');

casual.seed(123);

const data = [];

_.times(5, () => {

  data.push({
    model: 'authors',
    data: {
      id: uuid.v4(),
      firstName: casual.first_name,
      lastName: casual.last_name,
    }
  });
  
  data.push({
    model: 'posts',
    data: {
      author: data[data.length-1].data.id,
      title: `A post by ${data[data.length-1].data.firstName}`,
      text: casual.sentences(3)
    }
  });


});

module.exports = data;