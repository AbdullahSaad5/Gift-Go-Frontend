import { Group, HoverCard, Switch, Text } from "@mantine/core";
import ActionIcons from "../../components/general/ActionIcons";
import Button from "../../components/general/Button";
import ReceiveMoney from "./ReceiveMoney";
import TableImageView from "../../components/general/TableImageView";

export const Columns = (onHandleStatus) => [
  {
    name: "Serial No.",
    selector: (row) => row.serialNo,
    width: "120px",
    sortable: true,
  },
  {
    name: "Company Name",
    selector: (row) => row.fullName,
    width: "200px",
    sortable: true,
    cell: (row) => (
      <>
        <TableImageView src={row.logo} />
        {row.fullName}
      </>
    ),
  },
  {
    name: "User Type",
    selector: (row) => row.userType,
    sortable: true,
    width: "200px",
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
    // center: true,
    width: "230px",
  },
  {
    name: "Phone No.",
    selector: (row) => row.phone,
    sortable: true,
    // center: true,
    width: "160px",
  },
  {
    name: "Money Owed",
    selector: (row) => row.moneyOwed,
    sortable: true,
    center: true,
    width: "200px",
    cell: (row) =>
      row.moneyOwed.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
  },
  {
    name: "Money Owed Over Lifetime",
    selector: (row) => row.moneyOverLifetime,
    sortable: true,
    center: true,
    width: "250px",
    cell: (row) =>
      row.moneyOverLifetime.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
  },
  {
    name: "Money Waived",
    selector: (row) => row.moneyWaivedOverLifetime,
    sortable: true,
    center: true,
    width: "200px",
    cell: (row) =>
      row.moneyWaivedOverLifetime.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
  },
  {
    name: "Receive",
    center: true,
    width: "200px",
    cell: (row) => <ReceiveMoney row={row} type="receive" />,
  },
  {
    name: "Waive",
    center: true,
    width: "200px",
    cell: (row) => <ReceiveMoney row={row} type="waive" />,
  },
];
