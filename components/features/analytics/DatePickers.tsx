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
        spacing={{ xs: 1, md: 2 }}
        justifyContent={{ xs: "flex-start", md: "center" }}
        direction={{ xs: "column", md: "row" }}
        sx={{ m: { xs: 1, md: 2 } }}
      >
        <DatePicker
          label="Start Date"
          views={["year", "month"]}
          format="MM/YYYY"
          value={startDate}
          onChange={onStartDateChange}
          sx={{
            m: { xs: 1, md: 2 },
            width: { xs: "100%", md: "auto" },
          }}
        />
        <DatePicker
          label="End Date"
          views={["year", "month"]}
          format="MM/YYYY"
          value={endDate}
          onChange={onEndDateChange}
          sx={{
            m: { xs: 1, md: 2 },
            width: { xs: "100%", md: "auto" },
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
}
