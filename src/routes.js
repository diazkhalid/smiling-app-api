/* eslint-disable linebreak-style */
const {
  getAllBooks, getBookByIdHandler, getImgByIdHandler, getThumbByIdHandler, searchStoryHandler,
} = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/images/{idS}/{id}',
    handler: getImgByIdHandler,
  },
  {
    method: 'GET',
    path: '/thumbnail/{id}',
    handler: getThumbByIdHandler,
  },
  {
    method: 'GET',
    path: '/list',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/story/{id}',
    handler: getBookByIdHandler,
  },
  {
    method: 'GET',
    path: '/story/search',
    handler: searchStoryHandler,
  },
];

module.exports = routes;
