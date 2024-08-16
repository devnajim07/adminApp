const DateTimeUtils = require('../utils/dateTimeUtils');

describe('DateTimeUtils', () => {
  let dateTimeUtils;

  beforeAll(() => {
    dateTimeUtils = new DateTimeUtils();
  });

  test('should return the current timestamp in default format', () => {
    const result = dateTimeUtils.getCurrentTimestamp();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  test('should return the current timestamp in the specified format', () => {
    const result = dateTimeUtils.getCurrentTimestamp('YYYY/MM/DD');
    expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
  });

  test('should return the current unix timestamp when no dateTime is provided', () => {
    const result = dateTimeUtils.getUnixTimestamp();
    expect(result).toBeGreaterThan(0);
  });

  test('should return the correct unix timestamp for a given date', () => {
    const dateTime = '2024-08-17 15:00:00';
    const result = dateTimeUtils.getUnixTimestamp(dateTime, 'YYYY-MM-DD HH:mm:ss');
    expect(result).toBe(1723887000); // Expected Unix timestamp
  });

  test('should correctly format the given date to the specified format', () => {
    const dateTime = '2024-08-17';
    const result = dateTimeUtils.format(dateTime, 'MMMM D, YYYY', 'YYYY-MM-DD');
    expect(result).toBe('August 17, 2024');
  });

  test('should correctly calculate the difference between two dates in milliseconds', () => {
    const from = '2024-08-17 12:00:00';
    const to = '2024-08-17 14:00:00';
    const result = dateTimeUtils.getDiff(from, to, 'milliseconds');
    expect(result).toBe(7200000);
  });

  test('should correctly calculate the difference between two dates in hours with float', () => {
    const from = '2024-08-17 12:00:00';
    const to = '2024-08-17 14:30:00';
    const result = dateTimeUtils.getDiff(from, to, 'hour', true);
    expect(result).toBe(2.5);
  });

  test('should convert the given dateTime to UTC and format it', () => {
    const dateTime = '2024-08-17 07:00:00';
    const format = 'YYYY-MM-DD HH:mm:ss';
    const result = dateTimeUtils.convertToUtc(dateTime, format);
    expect(result).toBe('2024-08-17 01:30:00');
  });
});
