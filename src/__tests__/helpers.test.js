const { stringToDate, roundUpToCents, getWeekNumber } = require('../helpers');

test('stringToDate converts a date string to a Date object', () => {
  const dateString = '2024-07-02';
  const date = stringToDate(dateString);
  expect(date).toBeInstanceOf(Date);
  expect(date.getFullYear()).toBe(2024);
  expect(date.getMonth()).toBe(6);
  expect(date.getDate()).toBe(2);
});

test('roundUpToCents rounds up to the nearest cent', () => {
  expect(roundUpToCents(0.123)).toBe(0.13);
  expect(roundUpToCents(1.005)).toBe(1.01);
  expect(roundUpToCents(1.004)).toBe(1.01);
  expect(roundUpToCents(1.111)).toBe(1.12);
});

describe('getWeekNumber', () => {
  test('returns the correct ISO week number for a given date', () => {
    const date = new Date('2024-07-02');
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(27);
  });

  test('returns the correct ISO week number for dates before the first Monday of the year', () => {
    const date = new Date('2023-12-31');
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(53);
  });

  test('returns 1 for the first week of the year starting with Monday', () => {
    const date = new Date('2024-01-01');
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(1);
  });
});
