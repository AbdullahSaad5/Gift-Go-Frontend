import { Text } from "@mantine/core";
import ActionIcons from "../../components/general/ActionIcons";
import moment from "moment-timezone";
import TableImageView from "../../components/general/TableImageView";

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
    cell: (row) => (
      <>
        <TableImageView src={row.company.avatar} />
        {row.company.fullName}
      </>
    ),
  },
  {
    name: "Drop Name",
    selector: (row) => row.dropName,
    width: "200px",
    sortable: true,
  },
  {
    name: "Gift",
    selector: (row) => row.gift?.giftName,
    width: "200px",
    sortable: true,
    cell: (row) => (
      <>
        <TableImageView src={row.gift?.giftImage} />
        {row.gift?.giftName}
      </>
    ),
  },
  {
    name: "Gift Category",
    selector: (row) => row.gift?.giftCategory,
    width: "200px",
    sortable: true,
  },
  {
    name: "Schedule Date",
    selector: (row) => row.createdAt,
    sortable: true,
    width: "200px",
    cell: (row) => moment(row.scheduleDate).tz("Asia/Shanghai").format("DD-MM-YYYY - hh:mm A"),
  },
  {
    name: "Expiry Date",
    selector: (row) => row.expirationDateTime,
    sortable: true,
    width: "200px",
    cell: (row) => moment(row.expirationDateTime).format("MM/DD/YYYY hh:mm A"),
  },
  {
    name: "Actions",
    center: true,
    width: "100px",
    cell: (row) => <ActionIcons rowData={row} del={true} type="drops" />,
  },
];
