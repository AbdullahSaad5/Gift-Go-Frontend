import { Button, Text } from "@mantine/core";
import { Repeat } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
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
    name: "Gift",
    selector: (row) => row.gift?.giftName,
    sortable: true,
    // center: true,
    width: "140px",
  },
  {
    name: "Gift Category",
    selector: (row) => row.gift?.giftCategory,
    sortable: true,
    // center: true,
    width: "140px",
  },
  {
    name: "Center",
    selector: (row) => row.centerLocation,
    width: "200px",
    cell: (row) => (
      <a href={row.centerLocationURL} target="_blank">
        {row.centerLocation}
      </a>
    ),
    sortable: true,
  },
  {
    name: "Drops",
    selector: (row) => row.drops.length,
    sortable: true,
    // center: true,
    width: "100px",
  },
  {
    name: "Expiry",
    selector: (row) => row.expiry,
    sortable: true,
    center: true,
    width: "160px",
    cell: (row) => moment(row.expiry).tz("Asia/Shanghai").format("DD-MM-YYYY - hh:mm A"),
  },
  {
    name: "Is Expired",
    selector: (row) => row.expiry,
    sortable: true,
    center: true,
    width: "160px",
    cell: (row) => (moment(row.expiry).tz("Asia/Shanghai") < moment().tz("Asia/Shanghai") ? "Yes" : "No"),
  },
  {
    name: "Created At",
    selector: (row) => row.createdAt,
    sortable: true,
    center: true,
    width: "160px",
    cell: (row) => moment(row.createdAt).tz("Asia/Shanghai").format("DD-MM-YYYY - hh:mm A"),
  },
  {
    name: "Actions",
    center: true,
    width: "140px",
    cell: (row) => {
      return (
        <NavigateToAddDrop
          // disabled={
          // moment(row.expiry).tz("Asia/Shanghai") > moment().tz("Asia/Shanghai")
          // }
          center={row.center}
          dropsCount={row.drops.length}
          radius={row.radius}
          dropName={row.dropName}
          cardType={row.cardType}
          centerLocation={row.centerLocation}
          gift={row.gift._id}
          company={row.company?._id}
        />
      );
    },
  },
];

const NavigateToAddDrop = ({
  center,
  radius,
  dropsCount,
  disabled,
  dropName,
  cardType,
  centerLocation,
  gift,
  company,
}) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        navigate("/add-drop", {
          state: {
            center,
            radius,
            dropsCount,
            dropName,
            cardType,
            centerLocation,
            gift,
            company,
          },
        });
      }}
      style={{ cursor: disabled ? "default" : "pointer", display: "flex" }}
      disabled={disabled}
      variant="outline"
      leftSection={<Repeat color={disabled ? "grey" : "blue"} />}
    >
      Re-drop
    </Button>
  );
};
