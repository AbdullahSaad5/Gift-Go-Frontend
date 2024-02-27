import { Text } from "@mantine/core";

export const Columns = [
  {
    name: "Sr No.",
    selector: (row) => row.serialNo,
    width: "120px",
    sortable: true,
  },
  {
    name: "Offer Name",
    selector: (row) => row.dropName,
    width: "200px",
    sortable: true,
  },
  {
    name: "Offer Type",
    selector: (row) => row.dropType,
    width: "200px",
    sortable: true,
  },
  {
    name: "Offer Category",
    selector: (row) => row.dropCategory,
    width: "200px",
    sortable: true,
  },
  {
    name: "Claimed By",
    selector: (row) => row.scannedBy?.fullName,
    sortable: true,
    // center: true,
    width: "200px",
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
