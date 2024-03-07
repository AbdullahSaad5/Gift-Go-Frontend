import { Flex, Image, Stack, Switch, Text, Tooltip } from "@mantine/core";
import ActionIcons from "../../../components/general/ActionIcons";
import moment from "moment-timezone";

export const Columns = (setOpen, setEditData) => [
  {
    name: "Sr. No.",
    selector: (row) => row.serialNo,
    width: "120px",
    sortable: true,
  },
  {
    name: "Company",
    selector: (row) => row.company.fullName,
    grow: 1,
    sortable: true,
  },
  {
    name: "Drop Name",
    selector: (row) => row.dropName,
    grow: 1,
    sortable: true,
  },
  {
    name: "Gift",
    selector: (row) => row.gift?.giftName,
    grow: 1,
    sortable: true,
  },
  {
    name: "Gift Category",
    selector: (row) => row.gift?.giftCategory,
    grow: 1,
    sortable: true,
  },
  {
    name: "Drop Coordinates",
    selector: (row) => row.location.coordinates.join("-"),
    sortable: true,
    cell: (row) => (
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${row.location.coordinates.join(",")}`}
        target="_blank"
        rel="noreferrer"
      >
        Lat: {row.location.coordinates[0]}
        <br />
        Lng: {row.location.coordinates[1]}
      </a>
    ),
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
    cell: (row) => <ActionIcons rowData={row} del={true} type="drops" blocked={row.scannedBy} />,
  },
];
