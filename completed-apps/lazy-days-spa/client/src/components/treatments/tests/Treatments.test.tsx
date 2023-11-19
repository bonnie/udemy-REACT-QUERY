import { screen } from "@testing-library/react";

import { Treatments } from "../Treatments";

import { renderWithQueryClient } from "@/test-utils";

test("renders response from query", async () => {
  renderWithQueryClient(<Treatments />);

  const treatmentTitles = await screen.findAllByRole("heading", {
    name: /massage|facial|scrub/i,
  });
  expect(treatmentTitles).toHaveLength(3);
});
