const app = require('./model');
// const valid = require('va')

describe('Card Validation', () => {
  test('should accept valid number', () => {
    expect(app.validateCardNumber('sdfsdsf')).toBe('undefined');
  });
});
