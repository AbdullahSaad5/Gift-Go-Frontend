import { Box, Flex } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import { Columns } from "./TableHeader";
import InputField from "../../components/general/InputField";
import SelectMenu from "../../components/general/SelectMenu";
import Button from "../../components/general/Button";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { backendUrl } from "../../constants";
import axios from "axios";
import { UserContext } from "../../context";
import toast from "react-hot-toast";

const RewardRequests = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { status } = useQuery(
    "fetchRequests",
    () => {
      return axios.get(backendUrl + "/drops/not-claimed", {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (res) => {
        const data = res.data.data;
        let newData = data.map((obj, ind) => {
          return { ...obj, serialNo: ind + 1 };
        });
        setData(newData);
        toast.dismiss();
      },
    }
  );

  return (
    <Box>
      <PageHeader title={"Reward Requests"} subTitle={"View Reward Requests of your players"} />
      <Flex gap="md" my="md">
        <InputField
          placeholder={"Search Drop here..."}
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
            setFilter("All");
          }}
        />
      </Flex>
      <DataGrid data={data} columns={Columns} progressLoading={status === "loading"} />
    </Box>
  );
};

export default RewardRequests;
