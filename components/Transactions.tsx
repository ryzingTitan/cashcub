import { useToggle } from "usehooks-ts";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import useSWR from "swr";
import { getAllTransactions } from "@/lib/transactions";
import dayjs from "dayjs";
import { formatToCurrency } from "@/lib/utils";

interface TransactionsProps {
  budgetId: string;
  budgetItemId: string;
}

export default function Transactions({
  budgetId,
  budgetItemId,
}: TransactionsProps) {
  const [value, toggle] = useToggle(false);
  const { data, isLoading } = useSWR(
    `/budgets/${budgetId}/items/${budgetItemId}/transactions`,
    getAllTransactions,
  );

  const rows: GridRowsProp = data || [];

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return "";
        }
        return `${dayjs(value).format("MMM DD")}`;
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      valueFormatter: (value?: number) => {
        if (value == null) {
          return "";
        }
        return `${formatToCurrency(value)}`;
      },
    },
    { field: "merchant", headerName: "Merchant" },
    { field: "notes", headerName: "Notes" },
  ];

  return (
    <>
      <Tooltip title="View Transactions">
        <IconButton>
          <ReceiptIcon onClick={toggle} />
        </IconButton>
      </Tooltip>
      <Dialog onClose={toggle} open={value} fullWidth={true} maxWidth={"xl"}>
        <DialogTitle>Transactions</DialogTitle>
        <DialogContent>
          <DataGrid rows={rows} columns={columns} loading={isLoading} />
        </DialogContent>
      </Dialog>
    </>
  );
}
