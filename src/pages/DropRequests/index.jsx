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

const DropRequests = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: ["places", "geometry", "drawing"],
  });
  const { status, isFetching } = useQuery(
    "fetchDropRequests",
    () => {
      return axios.get(backendUrl + "/drop-request", {
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
          newData = res;
        });

        setData(newData);
      },
      enabled: isLoaded,
    }
  );
  const filteredItems = data.filter((item) => {
    if (!search) return true;
    return (
      item?.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      item?.type?.toLowerCase().includes(search.toLowerCase())
    );
  });
  return (
    <Box>
      <PageHeader title={"Drop Requests"} subTitle={"View all of your Drop Requests"} />
      <Flex gap="md" my="md">
        <InputField
          placeholder={"Search Drop..."}
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

export default DropRequests;
