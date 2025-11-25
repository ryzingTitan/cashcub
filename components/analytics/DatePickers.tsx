"use client";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Stack } from "@mui/material";
import { Dayjs } from "dayjs";

interface DatePickersProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (newValue: Dayjs | null) => void;
  onEndDateChange: (newValue: Dayjs | null) => void;
}

export default function DatePickers({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DatePickersProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        data-testid="date-pickers"
        spacing={2}
        justifyContent={"center"}
        direction={"row"}
        sx={{ m: 2 }}
      >
        <DatePicker
          label="Start Date"
          views={["year", "month"]}
          format="MM/YYYY"
          value={startDate}
          onChange={onStartDateChange}
          sx={{ m: 2 }}
        />
        <DatePicker
          label="End Date"
          views={["year", "month"]}
          format="MM/YYYY"
          value={endDate}
          onChange={onEndDateChange}
          sx={{ m: 2 }}
        />
      </Stack>
    </LocalizationProvider>
  );
}
