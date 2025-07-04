export class NotFoundError extends Error {
  constructor(entity: string, key: string, attribute: string = 'id') {
    super(`${entity} with ${attribute} ${key} not found`);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Access forbidden') {
    super(message);
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
  }
}
