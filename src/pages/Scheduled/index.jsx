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
import SelectMenu from "../../components/general/SelectMenu";

const Scheduled = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [dropType, setDropType] = useState("");
  const { isFetching, isLoading } = useQuery(
    "fetchScheduled",
    () => {
      return axios.get(backendUrl + "/drops/scheduled", {
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
      },
    }
  );
  const filteredItems = data.filter(
    (item) =>
      (item?.dropName?.toLowerCase().includes(search.toLowerCase()) ||
        item?.gift?.giftName?.toLowerCase().includes(search.toLowerCase()) ||
        item?.company?.fullName?.toLowerCase().includes(search.toLowerCase())) &&
      (!dropType ? true : item?.gift?.giftCategory.toLowerCase() === dropType.toLocaleLowerCase())
  );
  return (
    <Box>
      <PageHeader title={"Scheduled"} subTitle={"View all of your Scheduled drops"} />
      <Flex gap="md" my="md">
        <InputField
          placeholder={"Search Drop here..."}
          style={{ flex: 1 }}
          leftIcon={"search"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SelectMenu
          data={["Silver", "Gold", "Platinum"]}
          value={dropType}
          onChange={(e) => setDropType(e)}
          placeholder={"Select Drop Type"}
        />
        <Button
          primary={false}
          label={"Clear"}
          onClick={() => {
            setSearch("");
            setDropType(null);
          }}
        />
      </Flex>
      <DataGrid data={filteredItems} columns={Columns} progressPending={isLoading || isFetching} />
    </Box>
  );
};

export default Scheduled;
