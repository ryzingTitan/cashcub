import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DatePickers from "./DatePickers";
import dayjs from "dayjs";
import { describe, it, expect, vi } from "vitest";

describe("DatePickers", () => {
  it("renders the date pickers", () => {
    render(
      <DatePickers
        startDate={null}
        endDate={null}
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
      />
    );

    expect(screen.getAllByLabelText("Start Date")[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText("End Date")[0]).toBeInTheDocument();
  });

  it(
    "calls onStartDateChange with the correct value when a month is selected",
    async () => {
      const onStartDateChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DatePickers
          startDate={null}
          endDate={null}
          onStartDateChange={onStartDateChange}
          onEndDateChange={() => {}}
        />
      );

      const openCalendarButtons = screen.getAllByLabelText("Choose date");
      await user.click(openCalendarButtons[0]);

      const popover = screen.getByRole("dialog");
      const yearButton = await within(popover).findByRole("radio", {
        name: "2025",
      });
      await user.click(yearButton);

      const juneButton = await within(popover).findByRole("radio", {
        name: "June",
      });
      await user.click(juneButton);

      // The callback is called twice because the year and month are selected separately.
      expect(onStartDateChange).toHaveBeenCalledTimes(2);
      const result = onStartDateChange.mock.calls[1][0];
      expect(dayjs(result).year()).toBe(2025);
      expect(dayjs(result).month()).toBe(5); // June is 5
    },
    10000
  );

  it(
    "calls onEndDateChange with the correct value when a month is selected",
    async () => {
      const onEndDateChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DatePickers
          startDate={null}
          endDate={null}
          onStartDateChange={() => {}}
          onEndDateChange={onEndDateChange}
        />
      );

      const openCalendarButtons = screen.getAllByLabelText("Choose date");
      await user.click(openCalendarButtons[1]);

      const popover = screen.getByRole("dialog");
      const yearButton = await within(popover).findByRole("radio", {
        name: "2025",
      });
      await user.click(yearButton);

      const decemberButton = await within(popover).findByRole("radio", {
        name: "December",
      });
      await user.click(decemberButton);

      // The callback is called twice because the year and month are selected separately.
      expect(onEndDateChange).toHaveBeenCalledTimes(2);
      const result = onEndDateChange.mock.calls[1][0];
      expect(dayjs(result).year()).toBe(2025);
      expect(dayjs(result).month()).toBe(11); // December is 11
    },
    10000
  );
});
