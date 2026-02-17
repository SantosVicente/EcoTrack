import { formatCurrency, formatDate } from './formatter.js';

describe('formatter', () => {
  describe('formatCurrency', () => {
    it('should format number as currency', () => {
      const result = formatCurrency(100);
      // We check for the presence of the currency symbol and number
      expect(result).toContain('R$');
      expect(result).toContain('100,00');
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const date = '2024-01-01T12:00:00Z';
      const result = formatDate(date);
      expect(result).toBe('01/01/2024');
    });
  });
});
