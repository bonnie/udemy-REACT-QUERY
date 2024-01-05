import dayjs from 'dayjs';

// for storing current month / year details
export interface MonthYear {
  startDate: dayjs.Dayjs; // first day of the month
  firstDOW: number; // day of week; 0 === Sunday
  lastDate: number; // last date of the month
  monthName: string; // name of the month
  month: string; // two digit month number
  year: string; // four digit year
}

// for incrementing MonthYear
export function getUpdatedMonthYear(
  monthYear: MonthYear,
  monthIncrement: number,
): dayjs.Dayjs {
  // the clone is necessary to prevent mutation
  return monthYear.startDate.clone().add(monthIncrement, 'months');
}

// get calendar-relevant data for the month containing initialDate
export function getMonthYearDetails(initialDate: dayjs.Dayjs): MonthYear {
  const month = initialDate.format('MM');
  const year = initialDate.format('YYYY');
  const startDate = dayjs(`${year}${month}01`);
  const firstDOW = Number(startDate.format('d'));
  const lastDate = Number(startDate.clone().endOf('month').format('DD'));
  const monthName = startDate.format('MMMM');
  return { startDate, firstDOW, lastDate, monthName, month, year };
}

export function getNewMonthYear(
  prevData: MonthYear,
  monthIncrement: number,
): MonthYear {
  // update the monthYear by the specified increment
  const newMonthYear = getUpdatedMonthYear(prevData, monthIncrement);

  // return object with the details for the new monthYear
  return getMonthYearDetails(newMonthYear);
}
