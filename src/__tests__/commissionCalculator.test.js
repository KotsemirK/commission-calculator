const { commissionCalculator } = require('../commissionCalculator');
const {
  calculateCashInCommission,
  calculateCashOutNaturalCommission,
} = require('../commissionService');

const {
  roundUpToCents,
} = require('../helpers');

const {
  CASH_IN,
  CASH_OUT,
  NATURAL,
  EUR,
} = require('../constants');

jest.mock('../commissionService', () => ({
  calculateCashInCommission: jest.fn(),
  calculateCashOutNaturalCommission: jest.fn(),
  calculateCashOutJuridicalCommission: jest.fn(),
}));

jest.mock('../helpers', () => ({
  roundUpToCents: jest.fn((amount) => Math.ceil(amount * 100) / 100),
}));

describe('commissionCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('throws an error if currency is not EUR', async () => {
    const operation = {
      type: CASH_IN,
      user_type: NATURAL,
      operation: { amount: 100, currency: 'USD' },
    };

    await expect(commissionCalculator(operation)).rejects.toThrow('"USD" is unsupported currency. Only EUR is supported.');
  });

  test('rounds up the commission correctly', async () => {
    calculateCashInCommission.mockResolvedValue(2.345);

    const operation = {
      type: CASH_IN,
      user_type: NATURAL,
      operation: { amount: 10000, currency: EUR },
    };

    const commission = await commissionCalculator(operation);

    expect(roundUpToCents).toHaveBeenCalledWith(2.345);
    expect(commission).toBe(2.35);
  });

  test('throws an error if operation type is unsupported', async () => {
    const operation = {
      type: 'UNKNOWN_TYPE',
      user_type: NATURAL,
      operation: { amount: 1000, currency: EUR },
    };

    await expect(commissionCalculator(operation)).rejects.toThrow('"UNKNOWN_TYPE" is unsupported operation type. Only "cash_in" and "cash_out" is supported.');
  });

  test('throws an error if user type is unsupported for cash out', async () => {
    const operation = {
      type: CASH_OUT,
      user_type: 'UNKNOWN_USER_TYPE',
      operation: { amount: 1000, currency: EUR },
    };

    await expect(commissionCalculator(operation)).rejects.toThrow('"UNKNOWN_USER_TYPE" is unsupported user type. Only "juridical" and "natural" is supported.');
  });

  test('returns zero commission correctly', async () => {
    calculateCashOutNaturalCommission.mockResolvedValue(0);

    const operation = {
      type: CASH_OUT,
      user_type: NATURAL,
      operation: { amount: 500, currency: EUR },
    };

    const commission = await commissionCalculator(operation);

    expect(calculateCashOutNaturalCommission).toHaveBeenCalledWith(operation);
    expect(commission).toBe(0);
  });
});
