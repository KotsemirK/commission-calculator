# Commission Calculator

This project calculates commission fees for financial operations based on provided configuration and input data.

## Prerequisites
  Node.js (v12 or higher)
  npm (v6 or higher)

## Installation
1. Clone the repository:

   git clone <commission-calculator>

2. Install dependencies:

  npm install

## Running the System
To calculate commissions based on input data, run the following command:

  npm start

## Running Tests
To run the system tests, use the following command:

  npm test

## Project Structure
  ``src/commissionCalculator.js: Contains the main function to calculate commissions based on the operation type and user type.
  ``src/commissionService.js: Contains functions for calculating commissions for different types of transactions (cash in, cash out natural, cash out juridical).
  ``src/configApiService.js: Contains functions to fetch configuration data from external APIs.
  ``src/helpers.js: Contains helper functions for date conversion, rounding amounts, and determining week numbers.
  ``src/constants.js: Contains constants used throughout the project, such as API endpoints and transaction types.
  ``src/index.js: Entry point of the application. Reads the input file and processes the commissions.

## Functionality Overview
  The system calculates commissions for various types of financial operations:

1. Cash In:
  - The commission is calculated as a percentage of the amount, with a maximum cap.

2. Cash Out for Natural Persons:
  - There is a weekly limit of 1000.00 EUR without commission (Monday to Sunday).
  - If the total weekly amount exceeds the limit, the commission is calculated only on the exceeding amount.

3. Cash Out for Juridical Persons:
  - The commission is calculated as a percentage of the amount, with a minimum limit.

## Configuration and Caching
The system fetches configuration data from specified APIs and caches the results to avoid unnecessary network requests.

## Weekly Limit Handling
For natural persons, the system tracks the total amount of cash out operations within each week and applies commissions only when the weekly limit is exceeded.

## Error Handling
The system supports only EUR currency. An error is thrown for unsupported currencies, user type or operation types.

For more detailed information, refer to the comments in the code.