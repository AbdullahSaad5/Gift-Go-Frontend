import { Group, HoverCard, Switch, Text } from "@mantine/core";
import ActionIcons from "../../components/general/ActionIcons";
import Button from "../../components/general/Button";
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
    selector: (row) => row.company.fullName,
    width: "200px",
    sortable: true,
    cell: (row) => (
      <>
        <TableImageView src={row.company.logo} />
        {row.company.fullName}
      </>
    ),
  },
  {
    name: "Notification",
    selector: (row) => row.message,
    grow: 1,
    minWidth: "200px",
    sortable: true,
  },
  {
    name: "Added On",
    selector: (row) => row.createdAt,
    width: "150px",
    sortable: true,
    cell: (row) => new Date(row.createdAt).toLocaleString(),
  },
];
