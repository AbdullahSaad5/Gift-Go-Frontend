import { Button, Text, UnstyledButton } from "@mantine/core";
import { DiscountCheck } from "tabler-icons-react";
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
    width: "240px",
    sortable: true,
  },
  {
    name: "User",
    selector: (row) => row.user?.fullName,
    width: "240px",
    sortable: true,
  },
  {
    name: "Center",
    selector: (row) => row.centerLocation,
    cell: (row) => (
      <a href={row.centerLocationURL} target="_blank">
        {row.centerLocation}
      </a>
    ),
    sortable: true,
  },
  {
    name: "Request Type",
    selector: (row) => row.type,
    sortable: true,
    // center: true,
  },
  {
    name: "Created At",
    selector: (row) => row.createdAt,
    sortable: true,
    center: true,
    cell: (row) => <Text>{moment(row.createdAt).tz("Asia/Shanghai").format("DD-MM-YYYY")}</Text>,
  },
  {
    name: "Actions",
    center: true,
    cell: (row) => (
      <NavigateToAddDrop
        center={{
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng),
        }}
        radius={row.radius}
        dropName={row.dropName}
        centerLocation={row.centerLocation}
        company={row.company}
      />
    ),
  },
];

const NavigateToAddDrop = ({ center, radius, disabled, dropName, centerLocation, company }) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        // console.log({
        //   center,
        //   radius,
        //   dropName,
        //   centerLocation,
        // });
        navigate("/add-drop", {
          state: {
            dropsCount: 20,
            center,
            dropName,
            radius,
            cardType: "Poker Card",
            centerLocation,
            company,
          },
        });
      }}
      style={{ cursor: disabled ? "default" : "pointer", display: "flex" }}
      disabled={disabled}
      variant="outline"
      leftSection={<DiscountCheck color={disabled ? "grey" : "blue"} />}
    >
      Add
    </Button>
  );
};
