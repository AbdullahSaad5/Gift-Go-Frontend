import { Box, Flex } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import { Columns } from "./TableHeader";
import InputField from "../../components/general/InputField";
import Button from "../../components/general/Button";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../context";
import { useDisclosure } from "@mantine/hooks";
import AddNotification from "./AddNotification";

const Notifications = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState(null);
  const [opened, { open, close }] = useDisclosure();

  const { status, isFetching } = useQuery(
    "fetchNotifications",
    () => {
      return axios.get(backendUrl + "/notifications", {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (res) => {
        const data = res.data.data;
        const length = data.length;
        let newData = data.map((obj, ind) => {
          // to show serial no. in reverse order so that latest user will be on top (for better UX for client)
          return { ...obj, serialNo: length - ind };
        });
        setData(newData);
      },
    }
  );
  const onHandleStatus = useMutation(
    async (values) => {
      return axios.patch(
        backendUrl + `/users/change-status/${values.id}`,
        {
          status: values.status,
        },
        {
          headers: {
            Authorization: `${user.accessToken}`,
          },
        }
      );
    },
    {
      onSuccess: (response) => {
        toast.success(response.data.message);
      },
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    }
  );
  const filteredItems = data.filter((item) => {
    return item?.message?.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <Box>
      <PageHeader title={"Notifications"} subTitle={"View all of your notifications"} />
      <Flex gap="md" my="md">
        <InputField
          placeholder={"Search here..."}
          style={{ flex: 1 }}
          leftIcon={"search"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          primary={false}
          label={"Clear"}
          onClick={() => {
            setSearch("");
            setUserType(null);
          }}
        />
        <Button
          primary={true}
          label={"Add Notification"}
          onClick={() => {
            open();
          }}
        />
      </Flex>
      <DataGrid
        data={filteredItems}
        columns={Columns(onHandleStatus)}
        progressPending={status === "loading" || isFetching}
      />
      <AddNotification opened={opened} open={open} close={close} />
    </Box>
  );
};

export default Notifications;
