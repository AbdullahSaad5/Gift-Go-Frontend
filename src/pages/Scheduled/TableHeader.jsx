import { Text } from "@mantine/core";
import ActionIcons from "../../components/general/ActionIcons";
import moment from "moment-timezone";

export const Columns = [
  {
    name: "Sr No.",
    selector: (row) => row.serialNo,
    width: "100px",
    sortable: true,
  },
  {
    name: "Company",
    selector: (row) => row.company.fullName,
    width: "200px",
    sortable: true,
  },
  {
    name: "Drop Name",
    selector: (row) => row.dropName,
    width: "200px",
    sortable: true,
    center: "true",
  },
  {
    name: "Schedule Date",
    selector: (row) => row.createdAt,
    sortable: true,
    center: true,
    cell: (row) => moment(row.scheduleDate).tz("Asia/Shanghai").format("DD-MM-YYYY - hh:mm A"),
  },

  {
    name: "Expiry Date",
    selector: (row) => row.expirationDate,
    sortable: true,
    cell: (row) => moment(row.expirationDate).tz("Asia/Shanghai").format("DD-MM-YYYY - hh:mm A"),
  },

  {
    name: "Actions",
    center: true,
    width: "100px",
    cell: (row) => <ActionIcons rowData={row} del={true} type="drops" />,
  },
];
