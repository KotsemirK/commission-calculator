const { getCashInConfig, getCashOutJuridicalConfig, getCashOutNaturalConfig } = require('../configApiService');
const { calculateCashInCommission, calculateCashOutJuridicalCommission, calculateCashOutNaturalCommission } = require('../commissionService');

jest.mock('../configApiService', () => ({
  getCashInConfig: jest.fn(),
  getCashOutJuridicalConfig: jest.fn(),
  getCashOutNaturalConfig: jest.fn(),
}));

describe('calculateCashInCommission', () => {
  test('returns the correct commission when below the maximum limit', async () => {
    getCashInConfig.mockResolvedValue({
      percents: 0.03,
      max: { amount: 5.00 },
    });

    const amount = 10000;
    const commission = await calculateCashInCommission(amount);

    expect(commission).toBe(3.00);
  });

  test('returns the maximum commission when the calculated commission exceeds the limit', async () => {
    getCashInConfig.mockResolvedValue({
      percents: 0.03,
      max: { amount: 5.00 },
    });

    const amount = 20000;
    const commission = await calculateCashInCommission(amount);

    expect(commission).toBe(5.00);
  });

  test('returns zero commission for zero amount', async () => {
    getCashInConfig.mockResolvedValue({
      percents: 0.03,
      max: { amount: 5.00 },
    });

    const amount = 0;
    const commission = await calculateCashInCommission(amount);

    expect(commission).toBe(0.00);
  });
});

describe('calculateCashOutJuridicalCommission', () => {
  test('returns the correct commission when above the minimum limit', async () => {
    getCashOutJuridicalConfig.mockResolvedValue({
      percents: 0.3,
      min: {
        amount: 0.5,
      },
    });

    const amount = 200;
    const commission = await calculateCashOutJuridicalCommission(amount);

    expect(commission).toBe(0.6);
  });

  test('returns the minimum commission when the calculated commission is below the minimum limit', async () => {
    getCashOutJuridicalConfig.mockResolvedValue({
      percents: 0.3,
      min: {
        amount: 0.5,
      },
    });

    const amount = 100;
    const commission = await calculateCashOutJuridicalCommission(amount);

    expect(commission).toBe(0.5);
  });

  test('returns zero commission for zero amount', async () => {
    getCashOutJuridicalConfig.mockResolvedValue({
      percents: 0.3,
      min: {
        amount: 0.5,
      },
    });

    const amount = 0;
    const commission = await calculateCashOutJuridicalCommission(amount);

    expect(commission).toBe(0.5);
  });
});

describe('calculateCashOutNaturalCommission', () => {
  global.weeklyLimits = [];
  test('returns zero commission if amount is within weekly limit', async () => {
    getCashOutNaturalConfig.mockResolvedValue({
      percents: 0.3,
      week_limit: {
        amount: 1000,
      },
    });
    const operation = {
      date: '2024-07-01',
      user_id: 1,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 500,
        currency: 'EUR',
      },
    };

    const commission = await calculateCashOutNaturalCommission(operation);
    expect(commission).toBe(0);
  });

  test('returns correct commission if amount exceeds weekly limit', async () => {
    getCashOutNaturalConfig.mockResolvedValue({
      percents: 0.3,
      week_limit: {
        amount: 1000,
      },
    });
    const operation = {
      date: '2024-07-01',
      user_id: 2,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 1500,
        currency: 'EUR',
      },
    };

    const commission = await calculateCashOutNaturalCommission(operation);
    expect(commission).toBe(1.5);
  });

  test('returns correct commission for multiple operations within weekly limit', async () => {
    getCashOutNaturalConfig.mockResolvedValue({
      percents: 0.3,
      week_limit: {
        amount: 1000,
      },
    });
    const operation1 = {
      date: '2016-06-24',
      user_id: 5,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 600,
        currency: 'EUR',
      },
    };

    const operation2 = {
      date: '2016-06-25',
      user_id: 5,
      user_type: 'natural',
      type: 'cash_out',
      operation: {
        amount: 600,
        currency: 'EUR',
      },
    };

    await calculateCashOutNaturalCommission(operation1);
    const commission = await calculateCashOutNaturalCommission(operation2);

    expect(commission).toBe(0.6);
  });
});
