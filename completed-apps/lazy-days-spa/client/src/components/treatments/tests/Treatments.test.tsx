import { Treatments } from "../Treatments";

import { render, screen } from "@/test-utils";

test("renders response from query", async () => {
  render(<Treatments />);
  const treatmentTitles = await screen.findAllByRole("heading", {
    name: /massage|facial|scrub/i,
  });

  expect(treatmentTitles).toHaveLength(3);
});
