class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;
  }
}

class InvariantError extends ClientError {
  constructor(message = 'Permintaan tidak valid') {
    super(message, 400);
    this.name = 'InvariantError';
  }
}

class NotFoundError extends ClientError {
  constructor(message = 'Data tidak ditemukan') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  ClientError,
  InvariantError,
  NotFoundError,
};

