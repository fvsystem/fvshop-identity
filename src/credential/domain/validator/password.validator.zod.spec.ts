import { PasswordValidatorZod } from './password.validator.zod';

describe('PasswordValidatorZod', () => {
  it('should not accept an empty string', () => {
    const validator = new PasswordValidatorZod();
    expect(validator.validate({ password: '' })).toBe(false);
    expect(validator.errors).toEqual({
      password: [
        'Password must contain at least 8 characters long',
        'Password must contain at least one lowercase',
        'Password must contain at least one uppercase',
        'Password must contain at least one number',
      ],
    });
    expect(validator.validatedData).toBeNull();
  });
  it('should not accept a string with less than 8 characters', () => {
    const validator = new PasswordValidatorZod();
    expect(validator.validate({ password: '34fgJ' })).toBe(false);
    expect(validator.errors).toEqual({
      password: ['Password must contain at least 8 characters long'],
    });
    expect(validator.validatedData).toBeNull();
  });

  it('should not accept a string with no lowercase', () => {
    const validator = new PasswordValidatorZod();
    expect(validator.validate({ password: 'GDJDJFJRJ878FHF' })).toBe(false);
    expect(validator.errors).toEqual({
      password: ['Password must contain at least one lowercase'],
    });
    expect(validator.validatedData).toBeNull();
  });

  it('should not accept a string with no uppercase', () => {
    const validator = new PasswordValidatorZod();
    expect(validator.validate({ password: 'fhgjdhfdjh4343' })).toBe(false);
    expect(validator.errors).toEqual({
      password: ['Password must contain at least one uppercase'],
    });
    expect(validator.validatedData).toBeNull();
  });

  it('should not accept a string with no numbers', () => {
    const validator = new PasswordValidatorZod();
    expect(validator.validate({ password: 'fdfdDHFHFjfdf' })).toBe(false);
    expect(validator.errors).toEqual({
      password: ['Password must contain at least one number'],
    });
    expect(validator.validatedData).toBeNull();
  });

  it('should not accept a string with less than 8 characters', () => {
    const validator = new PasswordValidatorZod();
    expect(validator.validate({ password: 'fH5' })).toBe(false);
    expect(validator.errors).toEqual({
      password: ['Password must contain at least 8 characters long'],
    });
    expect(validator.validatedData).toBeNull();
  });

  it('should  accept a  valid password', () => {
    const validator = new PasswordValidatorZod();
    expect(validator.validate({ password: 'fH5fdfkkJfdkj4' })).toBe(true);
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toEqual({
      password: 'fH5fdfkkJfdkj4',
    });
  });
});
