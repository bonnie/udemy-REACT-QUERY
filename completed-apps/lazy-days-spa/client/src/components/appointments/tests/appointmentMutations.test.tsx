import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { Calendar } from "../Calendar";

import { renderWithProviders } from "@/test-utils";

test("Reserve appointment", async () => {
  renderWithProviders(<Calendar />);

  // find all the appointments
  const appointments = await screen.findAllByRole("button", {
    name: /\d\d? [ap]m\s+(scrub|facial|massage)/i,
  });

  // click on the first one to reserve
  fireEvent.click(appointments[0]);

  // check for the toast alert
  const alertToast = await screen.findByRole("status");
  expect(alertToast).toHaveTextContent("reserve");

  // close alert to keep state clean and wait for it to disappear
  const alertCloseButton = screen.getByRole("button", { name: "Close" });
  fireEvent.click(alertCloseButton);
  await waitForElementToBeRemoved(alertToast);
});

test("Cancel appointment", async () => {
  renderWithProviders(<Calendar />);

  // find all the cancel buttons
  const cancelButtons = await screen.findAllByRole("button", {
    name: /cancel appointment/i,
  });

  // click on the first one to cancel
  fireEvent.click(cancelButtons[0]);

  // check for the toast alert
  const alertToast = await screen.findByRole("status");
  expect(alertToast).toHaveTextContent("cancel");

  // close alert to keep state clean and wait for it to disappear
  const alertCloseButton = screen.getByRole("button", { name: "Close" });
  fireEvent.click(alertCloseButton);
  await waitForElementToBeRemoved(alertToast);
});
