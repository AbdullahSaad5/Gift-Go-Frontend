import { Box, Flex } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import { Columns } from "./TableHeader";
import InputField from "../../components/general/InputField";
import Button from "../../components/general/Button";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { backendUrl } from "../../constants";
import axios from "axios";
import { UserContext } from "../../context";

const Claimed = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const { status, isFetching } = useQuery(
    "fetchClaimed",
    () => {
      return axios.get(backendUrl + "/drops/claimed", {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (res) => {
        const data = res.data.data;
        let newData = data.map((obj, ind) => {
          if (obj.dropCoins === 0) obj.dropCoins = "Limit Reached";
          return { ...obj, serialNo: ind + 1 };
        });
        setData(newData);
      },
    }
  );
  const filteredItems = data.filter((item) => {
    return item?.dropName?.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <Box>
      <PageHeader title={"Claimed"} subTitle={"View all of your claimed drops"} />
      <Flex gap="md" my="md">
        <InputField
          placeholder={"Search Drop or Park here..."}
          style={{ flex: 1 }}
          leftIcon={"search"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button primary={false} label={"Clear"} onClick={() => setSearch("")} />
      </Flex>
      <DataGrid data={filteredItems} columns={Columns} progressPending={status === "loading" || isFetching} />
    </Box>
  );
};

export default Claimed;
