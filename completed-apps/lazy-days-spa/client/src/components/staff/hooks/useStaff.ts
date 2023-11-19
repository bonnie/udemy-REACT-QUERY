import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

import { axiosInstance } from "@src/axiosInstance";
import { queryKeys } from "@src/react-query/constants";
import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get("/staff");
  return data;
}

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");
  const selectFn = useCallback(
    (unfilteredStaff: Staff[]) => filterByTreatment(unfilteredStaff, filter),
    [filter]
  );

  const fallback: Staff[] = [];
  const { data: staff = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: filter !== "all" ? selectFn : undefined,
  });

  return { staff, filter, setFilter };
}
