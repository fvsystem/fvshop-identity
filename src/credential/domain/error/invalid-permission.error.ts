export class InvalidPermissionError extends Error {
  constructor(message?: string) {
    super(message || 'Invalid permission');
    this.name = 'InvalidPermission';
  }
}
