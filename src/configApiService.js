const axios = require('axios');

const {
  CASH_IN_API,
  CASH_OUT_NATURAL_API,
  CASH_OUT_JURIDICAL_API,
} = require('./constants');

// Caching API configurations
let cashInConfig;
let cashOutNaturalConfig;
let cashOutJuridicalConfig;

const getCashInConfig = async () => {
  if (!cashInConfig) {
    const response = await axios.get(CASH_IN_API);
    cashInConfig = response.data;
  }

  return cashInConfig;
};

const getCashOutNaturalConfig = async () => {
  if (!cashOutNaturalConfig) {
    const response = await axios.get(CASH_OUT_NATURAL_API);
    cashOutNaturalConfig = response.data;
  }

  return cashOutNaturalConfig;
};

const getCashOutJuridicalConfig = async () => {
  if (!cashOutJuridicalConfig) {
    const response = await axios.get(CASH_OUT_JURIDICAL_API);
    cashOutJuridicalConfig = response.data;
  }

  return cashOutJuridicalConfig;
};

module.exports = {
  getCashInConfig,
  getCashOutNaturalConfig,
  getCashOutJuridicalConfig,
};
