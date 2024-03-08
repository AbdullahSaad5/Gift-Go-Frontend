import { Badge, Group, HoverCard, Menu, Modal, Stack, Text } from "@mantine/core";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UserContext } from "../../context";
import toast from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "../../constants";
import Button from "../../components/general/Button";
import TableImageView from "../../components/general/TableImageView";
import { useDisclosure } from "@mantine/hooks";

export const Columns = [
  {
    name: "Sr No.",
    selector: (row) => row.serialNo,
    width: "120px",
    sortable: true,
  },
  {
    name: "Request By",
    selector: (row) => row.scannedBy?.fullName + "\n" + row.scannedBy?.email,
    sortable: true,
    cell: (row) => (
      <Stack gap={0} py="xs">
        <Text p={0} m={0}>
          {row.scannedBy?.fullName}
        </Text>
        <a size="xs" href={`mailto:${row.scannedBy?.email}`}>
          {row.scannedBy?.email}
        </a>
      </Stack>
    ),

    width: "250px",
  },
  {
    name: "Request Date",
    selector: (row) => row.createdAt,
    sortable: true,
    width: "220px",
    cell: (row) => <Text>{new Date(row.createdAt).toLocaleString()}</Text>,
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
    name: "Deliver Reward",
    selector: (row) => row.rewardDelivered,
    sortable: true,
    center: true,
    width: "200px",
    cell: (row) =>
      row.rewardDelivered ? (
        <Badge color="green" variant="light">
          Delivered
        </Badge>
      ) : (
        <DeliverButton id={row._id} data={row} />
      ),
  },
];

const StatusBadge = ({ status }) => {
  return (
    <Badge color={status === "Pending" ? "orange" : status === "Accepted" ? "green" : "red"} variant="light" w="100%">
      {status}
    </Badge>
  );
};

const DeliverButton = ({ id, data }) => {
  const [opened, { open, close }] = useDisclosure();

  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const { mutate, isLoading } = useMutation(
    (id) => {
      return axios.patch(backendUrl + `/drops/approve-reward/${id}`, null, {
        headers: {
          Authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: () => {
        const oldData = queryClient.getQueryData("fetchRequests").data.data;
        const newData = oldData.map((obj) => {
          if (obj._id === id) {
            return { ...obj, rewardDelivered: true };
          }
          return obj;
        });
        queryClient.setQueryData("fetchRequests", { data: newData });
        toast.success("Reward Delivered Successfully");
        close();
      },
      onError: (err) => {
        toast.error(err.response.data.message);
        close();
      },
    }
  );
  return (
    <>
      <Button
        variant="subtle"
        size="compact-lg"
        fz="sm"
        onClick={() => {
          open();
        }}
        loading={isLoading}
        disabled={data.rewardDelivered}
      >
        {data.rewardDelivered ? "Delivered" : "Deliver"}
      </Button>
      <Modal opened={opened} onClose={close} centered>
        <Text ta={"center"} fw={600} fz={"lg"}>
          Are you sure you want to deliver this reward?
        </Text>
        <Group justify="center" mt={"md"}>
          <Button
            label="Cancel"
            variant="outline"
            color="red"
            loading={isLoading}
            onClick={() => {
              close();
            }}
          />
          <Button
            label="Deliver"
            primary
            color="green"
            loading={isLoading}
            onClick={() => {
              mutate(id);
            }}
          />
        </Group>
      </Modal>
    </>
  );
};
