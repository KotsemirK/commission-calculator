const stringToDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);

  return date;
};

const roundUpToCents = (amount) => Math.ceil(amount * 100) / 100;

const getWeekNumber = (date) => {
  const currentDate = (typeof date === 'object') ? date : new Date();
  // Get January 1st of the current year
  const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
  // Calculate days until next Monday from January 1st
  const daysToNextMonday = (januaryFirst.getDay() === 1) ? 0 : (7 - januaryFirst.getDay()) % 7;

  // Calculate the date of the next Monday
  const nextMonday = new Date(
    currentDate.getFullYear(),
    0,
    januaryFirst.getDate() + daysToNextMonday,
  );

  let weekNumber = 1;

  // Determine the ISO week number
  if (currentDate < nextMonday) {
    weekNumber = 52;
    return weekNumber;
  }
  if (currentDate > nextMonday) {
    weekNumber = Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7);
    return weekNumber;
  }
  return weekNumber;
};

module.exports = {
  stringToDate,
  roundUpToCents,
  getWeekNumber,
};
