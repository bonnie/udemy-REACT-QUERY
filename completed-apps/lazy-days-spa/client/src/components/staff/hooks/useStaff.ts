import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get("/staff");
  return data;
}

// alternative to defining inside the hook with `useCallback`,
//   in lines 31 - 37
// suggested by Niv Bekelman in this Q&A thread
//   https://www.udemy.com/course/learn-react-query/learn/#questions/21529264/
// const selectFn = (unfilteredStaff: Staff[], filter: string) => {
//   if (filter === "all") return unfilteredStaff;
//   return filterByTreatment(unfilteredStaff, filter);
// };

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");

  // or, alternatively, define the function outside the hook
  //    as shown on lines 20 - 23
  const selectFn = useCallback(
    (unfilteredStaff: Staff[]) => {
      if (filter === "all") return unfilteredStaff;
      return filterByTreatment(unfilteredStaff, filter);
    },
    [filter]
  );

  const fallback: Staff[] = [];
  const { data: staff = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: selectFn,
    // or, if the selectFn is defined outside the hook
    //   as show in lines 20 - 23
    // select: (data) => selectFn(data, filter)
  });

  return { staff, filter, setFilter };
}
