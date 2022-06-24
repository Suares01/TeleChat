import { InternalError } from './InternalError';

export class NotFoundError extends InternalError {
  constructor(message, code = 404, description) {
    super(message, code, description);
  }
}
