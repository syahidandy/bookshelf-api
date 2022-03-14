const { nanoid } = require('nanoid');
const books = require('./books');

const saveBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBooks);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const showAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query;
  if (name !== undefined) {
    const showBooksByName = books.filter(
      (b) => b.name.toLowerCase().includes(name.toLowerCase()) === true,
    );
    const showBooks = showBooksByName.map((book) => ({
      id: book.id, name: book.name, publisher: book.publisher,
    }));
    return {
      status: 'success',
      data: {
        books: showBooks,
      },
    };
  }
  if (reading !== undefined) {
    let readingOrNot = false;
    if (reading === '1') {
      readingOrNot = true;
    }
    const showBooksByRead = books.filter((b) => b.reading === readingOrNot);
    const showBooks = showBooksByRead.map((book) => ({
      id: book.id, name: book.name, publisher: book.publisher,
    }));
    return {
      status: 'success',
      data: {
        books: showBooks,
      },
    };
  }
  if (finished !== undefined) {
    let finishedOrNot = false;
    if (finished === '1') {
      finishedOrNot = true;
    }
    const showBooksByFinish = books.filter((b) => b.finished === finishedOrNot);
    const showBooks = showBooksByFinish.map((book) => ({
      id: book.id, name: book.name, publisher: book.publisher,
    }));
    return {
      status: 'success',
      data: {
        books: showBooks,
      },
    };
  }
  const showBooks = books.map((book) => ({
    id: book.id, name: book.name, publisher: book.publisher,
  }));
  return {
    status: 'success',
    data: {
      books: showBooks,
    },
  };
};

const showBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const changeBookDataHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((b) => b.id === id);

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      updatedAt,
      reading,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteBookWithIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((b) => b.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  saveBookHandler,
  showAllBooksHandler,
  showBookByIdHandler,
  changeBookDataHandler,
  deleteBookWithIdHandler,
};
