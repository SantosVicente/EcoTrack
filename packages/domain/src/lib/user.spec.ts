import { LoginDto } from './user.interface.js';

describe('LoginDto', () => {
  it('should be able to instantiate', () => {
    const dto = new LoginDto();
    expect(dto).toBeDefined();
  });
});
