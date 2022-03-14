const {
  saveBookHandler,
  showAllBooksHandler,
  showBookByIdHandler,
  changeBookDataHandler,
  deleteBookWithIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: saveBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: showAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: showBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: changeBookDataHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookWithIdHandler,
  },
];

module.exports = routes;
