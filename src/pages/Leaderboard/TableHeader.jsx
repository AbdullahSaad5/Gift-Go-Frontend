import { Group, HoverCard, Switch, Text } from "@mantine/core";
import ActionIcons from "../../components/general/ActionIcons";
import TableImageView from "../../components/general/TableImageView";

export const Columns = (onHandleStatus) => [
  {
    name: "Serial No.",
    selector: (row) => row.serialNo,
    width: "120px",
    sortable: true,
  },
  {
    name: "Full Name",
    selector: (row) => row.fullName,
    width: "200px",
    sortable: true,
    cell: (row) => (
      <>
        <TableImageView src={row.avatar} />
        {row.fullName}
      </>
    ),
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
    name: "Registration Date",
    selector: (row) => row.createdAt,
    sortable: true,
    center: true,
    width: "200px",
    cell: (row) => <Text>{new Date(row.createdAt).toLocaleDateString()}</Text>,
  },
];
