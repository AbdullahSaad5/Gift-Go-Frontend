import { Box, Center, Loader, Stack } from "@mantine/core";
import { Autocomplete, GoogleMap, MarkerClustererF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import InputField from "../../components/general/InputField";
import PageHeader from "../../components/general/PageHeader";
import { useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { UserContext } from "../../context";

const libraries = ["places", "geometry", "drawing"];
const Live = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries,
  });

  const { user } = useContext(UserContext);
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({ lat: 30, lng: 70 });
  const [selectedPlace, setSelectedPlace] = useState(null);
  // Use the Geolocation API to get the user's location by default
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords?.latitude,
          lng: position.coords?.longitude,
        });
      });
    }
  }, []);

  const onPlaceChanged = () => {
    if (selectedPlace != null) {
      const place = selectedPlace.getPlace();
      setCenter({
        lat: place.geometry.location?.lat(),
        lng: place.geometry.location?.lng(),
      });
    } else {
      alert("Please enter text");
    }
  };

  const onLoad = useCallback((autocomplete) => {
    setSelectedPlace(autocomplete);
  }, []);

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
        let newData = data.map((obj) => {
          return {
            label: obj.dropName,
            coords: {
              lat: obj.location.coordinates[0],
              lng: obj.location.coordinates[1],
            },
          };
        });
        setMarkers(newData);
      },
    }
  );

  if (status === "loading")
    return (
      <Center>
        <Loader />
      </Center>
    );
  return (
    <Stack h={"100%"}>
      <PageHeader title={"Live"} subTitle={"View all of your live offers"} />
      {isLoaded && (
        <>
          <Autocomplete types={["geocode"]} onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <InputField placeholder="Search for a location" />
          </Autocomplete>
          <Box style={{ flex: 1 }}>
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "100%",
                borderRadius: "5px",
              }}
              center={center}
              zoom={3}
            >
              <MarkerClustererF>
                {(clusterer) => {
                  return markers.map((obj, ind) => (
                    <MarkerF position={obj.coords} title="Location" key={ind} label={obj.label} clusterer={clusterer} />
                  ));
                }}
              </MarkerClustererF>
            </GoogleMap>
          </Box>
        </>
      )}
    </Stack>
  );
};

export default Live;
