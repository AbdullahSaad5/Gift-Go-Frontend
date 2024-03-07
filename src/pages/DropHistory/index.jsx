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
import { useJsApiLoader } from "@react-google-maps/api";
import SelectMenu from "../../components/general/SelectMenu";

const DropHistory = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [dropType, setDropType] = useState("");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: ["places", "geometry", "drawing"],
  });

  const { isLoading, isFetching } = useQuery(
    "fetchDropHistory",
    () => {
      return axios.get(backendUrl + "/drop-collection", {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: async (res) => {
        const data = res.data.data;
        let newData = data.map(async (obj, ind) => {
          const geocoder = new window.google.maps.Geocoder();
          const latlng = {
            lat: parseFloat(obj.lat),
            lng: parseFloat(obj.lng),
          };
          let result = null;
          try {
            result = await geocoder.geocode({ location: latlng });
          } catch (err) {
            console.log(err);
            result = {
              formatted_address: "Location not found",
            };
          }
          if (result.results[0]) {
            result = result.results[0];
          }

          return {
            ...obj,
            serialNo: ind + 1,
            centerLocation: result.formatted_address,
            centerLocationURL: `https://www.google.com/maps/search/?api=1&query=${obj.lat},${obj.lng}`,
          };
        });

        await Promise.all(newData).then((res) => {
          setData(res);
        });
      },
      enabled: isLoaded,
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
      <PageHeader title={"Drop History"} subTitle={"View all of your Drop History"} />
      <Flex gap="md" my="md">
        <InputField
          placeholder={"Search Drop..."}
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

export default DropHistory;
