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
    grow: 1,
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
    grow: 1,
  },
  {
    name: "Phone No.",
    selector: (row) => row.phone,
    sortable: true,
    // center: true,
    grow: 1,
  },
  {
    name: "Position",
    selector: (row) => row.position,
    sortable: true,
    width: "160px",
    center: true,
  },
  {
    name: "Drops Claimed",
    selector: (row) => row.dropCount,
    sortable: true,
    width: "200px",
    center: true,
  },
];
