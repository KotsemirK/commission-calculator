const {
  calculateCashInCommission,
  calculateCashOutNaturalCommission,
  calculateCashOutJuridicalCommission,
} = require('./commissionService');

const {
  roundUpToCents,
} = require('./helpers');

const {
  CASH_IN,
  CASH_OUT,
  NATURAL,
  JURIDICAL,
  EUR,
} = require('./constants');

const commissionCalculator = async (operation) => {
  const { type, user_type: userId, operation: { amount, currency } } = operation;

  if (currency !== EUR) {
    throw new Error(`"${currency}" is unsupported currency. Only EUR is supported.`);
  }

  let commission;

  switch (type) {
  case CASH_IN:
    commission = await calculateCashInCommission(amount);
    break;

  case CASH_OUT:
    switch (userId) {
    case NATURAL:
      commission = await calculateCashOutNaturalCommission(operation);
      break;
    case JURIDICAL:
      commission = await calculateCashOutJuridicalCommission(amount);
      break;
    default:
      throw new Error(`"${userId}" is unsupported user type. Only "${JURIDICAL}" and "${NATURAL}" is supported.`);
    }
    break;

  default:
    throw new Error(`"${type}" is unsupported operation type. Only "${CASH_IN}" and "${CASH_OUT}" is supported.`);
  }

  return commission === 0 ? 0 : roundUpToCents(commission);
};

module.exports = { commissionCalculator };
