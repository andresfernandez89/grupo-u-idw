export class AppError extends Error {
  constructor(message, code, statusCode) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, "NOT_FOUND", 404);
  }
}

export class DuplicateError extends AppError {
  constructor(message = "El recurso ya existe") {
    super(message, "DUPLICATE", 409);
  }
}

export class ForeignKeyError extends AppError {
  constructor(message = "La referencia no existe o no está activa") {
    super(message, "FK_ERROR", 400);
  }
}
