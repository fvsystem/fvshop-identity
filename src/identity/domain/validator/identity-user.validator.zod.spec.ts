import { IdentityUserValidatorZod } from './identity-user.validator.zod';

describe('IdentityUserValidatorZod', () => {
  it('should not accept an empty string', () => {
    const validator = new IdentityUserValidatorZod();
    expect(validator.validate({ email: '' })).toBe(false);
    expect(validator.errors).toEqual({
      email: ['Email is not valid'],
    });
    expect(validator.validatedData).toBeNull();
  });
  it('should not accept a invalid email', () => {
    const validator = new IdentityUserValidatorZod();
    expect(validator.validate({ email: 'fsdfdf' })).toBe(false);
    expect(validator.errors).toEqual({
      email: ['Email is not valid'],
    });
    expect(validator.validatedData).toBeNull();
  });

  it('should not accept non string value', () => {
    const validator = new IdentityUserValidatorZod();
    expect(validator.validate({ email: 4 })).toBe(false);
    expect(validator.errors).toEqual({
      email: ['Expected string, received number'],
    });
    expect(validator.validatedData).toBeNull();
  });

  it('should  accept a  valid email', () => {
    const validator = new IdentityUserValidatorZod();
    expect(validator.validate({ email: 'test@test.com' })).toBe(true);
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toEqual({
      email: 'test@test.com',
    });
  });
});
