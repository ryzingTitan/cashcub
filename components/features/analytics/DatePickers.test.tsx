import { render, screen } from "@testing-library/react";
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
      />,
    );

    expect(screen.getAllByLabelText("Start Date")[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText("End Date")[0]).toBeInTheDocument();
  });

  it("renders with provided start date value", () => {
    const startDate = dayjs("2024-06-15");
    render(
      <DatePickers
        startDate={startDate}
        endDate={null}
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
      />,
    );

    // Verify the date picker is rendered with a label
    expect(screen.getAllByLabelText("Start Date")[0]).toBeInTheDocument();
    // Verify the formatted date appears in the document
    expect(screen.getByDisplayValue("06/2024")).toBeInTheDocument();
  });

  it("renders with provided end date value", () => {
    const endDate = dayjs("2024-12-31");
    render(
      <DatePickers
        startDate={null}
        endDate={endDate}
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
      />,
    );

    // Verify the date picker is rendered with a label
    expect(screen.getAllByLabelText("End Date")[0]).toBeInTheDocument();
    // Verify the formatted date appears in the document
    expect(screen.getByDisplayValue("12/2024")).toBeInTheDocument();
  });

  it("provides callbacks for date changes", () => {
    const onStartDateChange = vi.fn();
    const onEndDateChange = vi.fn();

    render(
      <DatePickers
        startDate={null}
        endDate={null}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />,
    );

    // Verify the pickers are rendered with the correct labels
    expect(screen.getAllByLabelText("Start Date")[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText("End Date")[0]).toBeInTheDocument();
  });
});
