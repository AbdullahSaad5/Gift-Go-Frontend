import { Box, Flex, Select } from "@mantine/core";
import PageHeader from "../../../components/general/PageHeader";
import DataGrid from "../../../components/general/Table";
import { Columns } from "./TableHeader";
import InputField from "../../../components/general/InputField";
import Button from "../../../components/general/Button";
import { useContext, useState } from "react";
import { backendUrl } from "../../../constants";
import axios from "axios";
import { useQuery } from "react-query";
import { UserContext } from "../../../context";
import { useNavigate } from "react-router-dom";
import SelectMenu from "../../../components/general/SelectMenu";

const ViewDrops = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const { status } = useQuery(
    "fetchDrops",
    () => {
      return axios.get(backendUrl + "/drops", {
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
  const [dropType, setDropType] = useState("");
  const filteredItems = data.filter((item) => {
    let droptype = !dropType ? true : item?.cardType === dropType;
    return item?.dropName?.toLowerCase().includes(search.toLowerCase()) && droptype;
  });
  return (
    <Box>
      <PageHeader title={"Drops"} subTitle={"View all drops in your system"} />

      <Flex gap="md" my="md" wrap={"wrap"} align={"center"}>
        <InputField
          placeholder={"Search here..."}
          style={{ flex: 1, minWidth: "200px" }}
          leftIcon={"search"}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SelectMenu
          data={["Gift", "Coupon"]}
          onChange={(e) => setDropType(e)}
          value={dropType}
          placeholder={"Select Drop Type"}
        />
        <Button
          primary={false}
          onClick={() => {
            setSearch("");
            setDropType(null);
          }}
        >
          Clear
        </Button>
        <Button onClick={() => navigate("/add-drop")}>Add Drop</Button>
      </Flex>
      <DataGrid data={filteredItems} columns={Columns(setOpen)} progressPending={status === "loading"} />
    </Box>
  );
};

export default ViewDrops;
