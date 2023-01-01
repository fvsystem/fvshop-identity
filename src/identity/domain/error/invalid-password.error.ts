export class InvalidPasswordError extends Error {
  constructor(message?: string) {
    super(message || 'Invalid password');
    this.name = 'InvalidPasswordError';
  }
}
