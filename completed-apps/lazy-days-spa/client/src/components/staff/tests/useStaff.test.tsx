import { act, renderHook, waitFor } from "@testing-library/react";

import { useStaff } from "../hooks/useStaff";

import { createQueryClientWrapper } from "@/test-utils";

test("filter staff", async () => {
  const { result } = renderHook(() => useStaff(), {
    wrapper: createQueryClientWrapper(),
  });

  // wait for the staff to populate
  await waitFor(() => expect(result.current.staff).toHaveLength(4));

  // set to filter for only staff who give massage
  act(() => result.current.setFilter("facial"));

  // wait for the staff list to display only 3
  await waitFor(() => expect(result.current.staff).toHaveLength(3));
});
