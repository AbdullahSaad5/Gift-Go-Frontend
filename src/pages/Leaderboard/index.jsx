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
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import AddCompany from "../Companies/AddCompany";
import SelectMenu from "../../components/general/SelectMenu";

const Leaderboard = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [opened, { open, close }] = useDisclosure();

  const { status, isFetching } = useQuery(
    "fetchLeaderboard",
    () => {
      return axios.get(backendUrl + "/leaderboard", {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (res) => {
        const data = res.data.data;
        let newData = data.map((obj, ind) => {
          // to show serial no. in reverse order so that latest user will be on top (for better UX for client)
          return { ...obj, serialNo: ind + 1, position: ind + 1 };
        });
        setData(newData);
      },
    }
  );

  const filteredItems = data.filter((item) => {
    return (
      (item?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        item?.email?.toLowerCase().includes(search.toLowerCase())) &&
      (activeStatus ? item.status === activeStatus : true) &&
      (userType ? item.userType === userType : true)
    );
  });
  return (
    <Box>
      <PageHeader title={"Leaderboard"} subTitle={"View Top 10 Users on Leaderboard"} />
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
      </Flex>
      <DataGrid data={filteredItems} columns={Columns()} progressPending={status === "loading" || isFetching} />
      <AddCompany opened={opened} open={open} close={close} />
    </Box>
  );
};

export default Leaderboard;
