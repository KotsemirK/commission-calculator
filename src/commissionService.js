const {
  stringToDate,
  getWeekNumber,
} = require('./helpers');

const {
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig,
} = require('./configApiService');

const weeklyLimits = [];

const calculateCashOutNaturalCommission = async (operation) => {
  const { operation: { amount }, date, user_id: userId } = operation;
  const { percents, week_limit: { amount: amountLimitConfig } } = await getCashOutNaturalConfig();

  let commission = 0;

  const parsedDate = stringToDate(date);
  const weekNumber = getWeekNumber(parsedDate);
  const year = parsedDate.getUTCFullYear();

  const findWeeklyLimitInArray = (limitsArray, uid, weekNum, yr) => limitsArray.find(
    (limit) => limit.userId === uid
      && limit.weekNumber === weekNum
      && limit.year === yr,
  );

  const existingWeeklyLimit = findWeeklyLimitInArray(weeklyLimits, userId, weekNumber, year);

  if (existingWeeklyLimit) {
    if (existingWeeklyLimit.amountLimit >= amount) {
      existingWeeklyLimit.amountLimit -= amount;
      return 0;
    }
    commission = ((amount - existingWeeklyLimit.amountLimit) * percents) / 100;
    existingWeeklyLimit.amountLimit = 0;
    return commission;
  }

  const createNewLimit = (newLimit) => {
    const newWeeklyLimit = {
      userId,
      amountLimit: newLimit,
      weekNumber,
      year,
    };
    weeklyLimits.push(newWeeklyLimit);
  };

  if (amount > amountLimitConfig) {
    createNewLimit(0);
    commission = ((amount - amountLimitConfig) * percents) / 100;
    return commission;
  }

  createNewLimit(amountLimitConfig - amount);
  return commission;
};

const calculateCashInCommission = async (amount) => {
  const { percents, max: { amount: maxCommission } } = await getCashInConfig();

  let commission = (amount * percents) / 100;
  commission = Math.min(commission, maxCommission);

  return commission;
};

const calculateCashOutJuridicalCommission = async (amount) => {
  const { percents, min: { amount: minCommission } } = await getCashOutJuridicalConfig();

  let commission = (amount * percents) / 100;
  commission = Math.max(commission, minCommission);

  return commission;
};

module.exports = {
  calculateCashInCommission,
  calculateCashOutNaturalCommission,
  calculateCashOutJuridicalCommission,
};
