import { Text } from "@mantine/core";
import TableImageView from "../../components/general/TableImageView";

export const Columns = [
  {
    name: "Sr No.",
    selector: (row) => row.serialNo,
    width: "120px",
    sortable: true,
  },
  {
    name: "Company",
    selector: (row) => row.company?.companyName,
    width: "200px",
    sortable: true,
    cell: (row) => (
      <>
        <TableImageView src={row.company?.avatar} />
        {row.company?.fullName}
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
    name: "Gift Name",
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
    name: "Claimed By",
    selector: (row) => row.scannedBy?.fullName,
    sortable: true,
    // center: true,
    width: "200px",
    cell: (row) => (
      <>
        <TableImageView src={row.scannedBy?.avatar} />
        {row.scannedBy?.fullName}
      </>
    ),
  },
  {
    name: "Claimed Date",
    selector: (row) => row.createdAt,
    sortable: true,
    center: true,
    width: "200px",
    cell: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    name: "Claimed Time",
    selector: (row) => row.createdAt,
    sortable: true,
    center: true,
    width: "200px",
    cell: (row) => new Date(row.createdAt).toLocaleTimeString(),
  },
];
