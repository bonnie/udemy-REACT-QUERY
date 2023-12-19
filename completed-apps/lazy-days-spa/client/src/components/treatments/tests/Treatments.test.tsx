import { screen } from "@testing-library/react";

import { Treatments } from "../Treatments";

import { renderWithProviders } from "@/test-utils";

test("renders response from query", async () => {
  renderWithProviders(<Treatments />);

  const treatmentTitles = await screen.findAllByRole("heading", {
    name: /massage|facial|scrub/i,
  });
  expect(treatmentTitles).toHaveLength(3);
});
