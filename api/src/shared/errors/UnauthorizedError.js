import { InternalError } from './InternalError';

export class UnauthorizedError extends InternalError {
  constructor(message, code = 401, description) {
    super(message, code, description);
  }
}
