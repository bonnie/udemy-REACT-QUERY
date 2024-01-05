import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

import { AppointmentDateMap } from "../types";
import { getAvailableAppointments } from "../utils";
import { getMonthYearDetails, getNewMonthYear } from "./monthYear";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// for useQuery and prefetchQuery
const commonOptions = {
  staleTime: 0,
  gcTime: 30000, // 5 minutes
};

// for useQuery call
async function getAppointments(
  year: string,
  month: string
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

// The purpose of this hook:
//   1. track the current month/year (aka monthYear) selected by the user
//     1a. provide a way to update state
//   2. return the appointments for that particular monthYear
//     2a. return in AppointmentDateMap format (appointment arrays indexed by day of month)
//     2b. prefetch the appointments for adjacent monthYears
//   3. track the state of the filter (all appointments / available appointments)
//     3a. return the only the applicable appointments for the current monthYear
export function useAppointments() {
  /** ****************** START 1: monthYear state *********************** */
  // get the monthYear for the current date (for default monthYear state)
  const currentMonthYear = getMonthYearDetails(dayjs());

  // state to track current monthYear chosen by user
  // state value is returned in hook return object
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  // setter to update monthYear obj in state when user changes month in view,
  // returned in hook return object
  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  /** ****************** END 1: monthYear state ************************* */
  /** ****************** START 2: filter appointments  ****************** */
  // State and functions for filtering appointments to show all or only available
  const [showAll, setShowAll] = useState(false);

  // We will need imported function getAvailableAppointments here
  // We need the user to pass to getAvailableAppointments so we can show
  //   appointments that the logged-in user has reserved (in white)
  const { userId } = useLoginData();

  const selectFn = useCallback(
    (data: AppointmentDateMap, showAll: boolean) => {
      if (showAll) return data;
      return getAvailableAppointments(data, userId);
    },
    [userId]
  );

  /** ****************** END 2: filter appointments  ******************** */
  /** ****************** START 3: useQuery  ***************************** */
  // useQuery call for appointments for the current monthYear

  // prefetch next month when monthYear changes
  const queryClient = useQueryClient();
  useEffect(() => {
    // assume increment of one month
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery({
      queryKey: [
        queryKeys.appointments,
        nextMonthYear.year,
        nextMonthYear.month,
      ],
      queryFn: () => getAppointments(nextMonthYear.year, nextMonthYear.month),
      ...commonOptions,
    });
  }, [queryClient, monthYear]);

  // Notes:
  //    1. appointments is an AppointmentDateMap (object with days of month
  //       as properties, and arrays of appointments for that day as values)
  //
  //    2. The getAppointments query function needs monthYear.year and
  //       monthYear.month
  const fallback: AppointmentDateMap = {};

  const { data: appointments = fallback } = useQuery({
    queryKey: [queryKeys.appointments, monthYear.year, monthYear.month],
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
    select: (data) => selectFn(data, showAll),
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // every minute
    ...commonOptions,
  });

  /** ****************** END 3: useQuery  ******************************* */

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
