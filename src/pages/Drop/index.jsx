import { Box, Checkbox, Flex, LoadingOverlay, Stack } from "@mantine/core";
import { DateInput, DateTimePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Autocomplete, CircleF, GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import Button from "../../components/general/Button";
import InputField from "../../components/general/InputField";
import PageHeader from "../../components/general/PageHeader";
import { backendUrl } from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context";
import SelectMenu from "../../components/general/SelectMenu";
import moment from "moment-timezone";

const Drop = () => {
  // get dropsCount, passedCenter, passedRadius from location state
  const {
    dropsCount,
    center: passedCenter,
    radius: passedRadius,
    centerLocation,
    dropName,
    cardType,
    company,
  } = useLocation().state || {};

  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [center, setCenter] = useState(passedCenter || { lat: 30, lng: 70 });
  const [radius, setRadius] = useState(passedRadius || 300);
  const [markers, setMarkers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formatted_address, setFormatted_address] = useState(centerLocation || "");
  const libraries = useMemo(() => ["places", "geometry", "drawing"], []);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries,
  });

  const dropTypes = ["Silver", "Gold", "Platinum"];

  const dropCategories = ["Gift", "Coupon"];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: "companies",
    queryFn: () => {
      return axios.get(backendUrl + "/users?userType=Company", {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    enabled: user?.userType === "Admin",
  });

  // Use the Geolocation API to get the user's location by default
  useEffect(() => {
    if (navigator.geolocation && !passedCenter) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  const form = useForm({
    initialValues: {
      locations: [],
      expirationDateTime: "",
      scheduleDateTime: "",
      dropName: dropName ? `Re-${dropName}` : "",
      dropType: "",
      dropCategory: "",
      numberOfDrops: dropsCount || "",
      schedule: false,
      company: company || "",
    },

    validate: {
      dropName: (value) => (value?.length > 0 ? null : "Enter Drop Name"),
      numberOfDrops: (value) => (value ? null : "Select Quantity"),
      expirationDateTime: (value) => (value ? null : "Select Expiration Date"),
      dropType: (value) => (value ? null : "Select Card Type"),
      company: (value) => (value ? null : "Select Company"),
      dropCategory: (value) => (value ? null : "Select Drop Category"),
      scheduleDateTime: (value, values) => (values.schedule && !value ? "Select Schedule Date" : null),
    },
  });
  const onPlaceChanged = () => {
    if (selectedPlace != null) {
      const place = selectedPlace.getPlace();
      const formatted_address = place.formatted_address;
      setFormatted_address(formatted_address);
      setCenter({
        lat: place.geometry?.location.lat(),
        lng: place.geometry?.location.lng(),
      });
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const onLoad = useCallback((autocomplete) => {
    setSelectedPlace(autocomplete);
  }, []);

  const handleAddDrop = useMutation(
    async (values) => {
      setLoading(true);
      const data = { ...values };

      data.locations = data.locations.map((obj) => Object.values(obj));
      data.center = center;
      data.radius = radius;

      if (user.userType === "Company") data.company = user._id;

      return axios.post(backendUrl + `/drops`, data, {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (response) => {
        toast.success(response.data.message);
        form.reset();
        setLoading(false);
        navigate("/drop");
      },
      onError: (err) => {
        toast.error(err.response.data.message);
        setLoading(false);
      },
    }
  );

  const generateOffers = () => {
    if (!form.values.numberOfDrops) return toast.error("Please enter the number of drops and try again!");
    // An array to store the generated points
    var points = [];
    // A constant for converting degrees to radians
    var DEG_TO_RAD = Math.PI / 180;
    // A constant for the Earth's radius in meters
    var EARTH_RADIUS = 6378100;
    // Loop for each point
    for (var i = 0; i < form.values.numberOfDrops; i++) {
      // Generate a random angle in radians
      var angle = Math.random() * Math.PI * 2;
      // Generate a random distance from the center in meters
      var distance = Math.random() * radius;
      // Calculate the offset in latitude and longitude using the haversine formula
      var latOffset = (distance * Math.cos(angle)) / EARTH_RADIUS / DEG_TO_RAD;
      var lngOffset = (distance * Math.sin(angle)) / EARTH_RADIUS / DEG_TO_RAD / Math.cos(center.lat * DEG_TO_RAD);
      // Add the offset to the center latitude and longitude
      var lat = center.lat + latOffset;
      var lng = center.lng + lngOffset; // Assuming the longitude is fixed at 123
      // Create an object with the latitude and longitude and push it to the array
      var point = { lat: lat, lng: lng };
      points.push(point);
    }
    // Return the array of points
    setMarkers(points);
    form.setFieldValue("locations", points);
  };

  return (
    <Box>
      <PageHeader title={"Drop Offers"} subTitle={"Drop your offer like its hot"} />

      <Flex gap="lg" wrap={{ base: "wrap", lg: "nowrap" }}>
        <Stack w={{ base: "100%", lg: "75%" }}>
          {isLoaded && (
            <>
              <Autocomplete types={["geocode"]} onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <InputField
                  label={"Search Location"}
                  value={formatted_address}
                  onChange={(val) => setFormatted_address(val.target.value)}
                  placeholder="Search for a location"
                />
              </Autocomplete>
              <Box style={{ minHeight: "500px", height: "100%" }}>
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "5px",
                  }}
                  center={center}
                  zoom={14}
                >
                  {markers.map((obj, ind) => (
                    <Marker draggable position={obj} title="Location" key={ind} />
                  ))}
                  {center?.lat && (
                    <CircleF
                      center={center}
                      radius={parseInt(radius)}
                      options={{
                        fillColor: "blue",
                        fillOpacity: 0.2,
                        strokeColor: "blue",
                        strokeOpacity: 0.8,
                      }}
                      draggable={true}
                      onDragEnd={(e) => {
                        setMarkers([]);
                        setCenter({
                          lat: e.latLng.lat(),
                          lng: e.latLng.lng(),
                        });
                      }}
                      onCenterChanged={() => {
                        setMarkers([]);
                      }}
                      onRadiusChanged={() => {
                        setMarkers([]);
                      }}
                    />
                  )}
                </GoogleMap>
              </Box>
            </>
          )}
        </Stack>
        <form style={{ flex: 1 }} onSubmit={form.onSubmit((values) => handleAddDrop.mutate(values))}>
          <Stack
            miw={320}
            style={{
              position: "relative",
            }}
          >
            <LoadingOverlay visible={isLoading || isFetching} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <InputField label={"Drop Name"} required form={form} validateName="dropName" />

            {user?.userType === "Admin" && (
              <SelectMenu
                label={"Select Company"}
                required
                form={form}
                searchable
                data={data?.data?.data?.map((obj) => {
                  return { value: obj._id, label: obj.fullName };
                })}
                validateName="company"
              />
            )}
            <SelectMenu
              label={"Select Drop Type"}
              required
              form={form}
              searchable
              data={dropTypes}
              validateName="dropType"
            />

            <SelectMenu
              label={"Select Drop Category"}
              required
              form={form}
              searchable
              data={dropCategories}
              validateName="dropCategory"
            />
            <InputField
              label={"Area (Radius)"}
              value={radius}
              required
              type="number"
              onChange={(e) => setRadius(parseInt(e.target.value))}
            />

            <InputField label={"Quantity"} required form={form} validateName="numberOfDrops" />

            <DateTimePicker
              label="Expiration Date and Time"
              minDate={new Date()}
              placeholder="Pick Expiration Date and Time"
              {...form.getInputProps("expirationDateTime")}
            />
            <Checkbox label="Schedule Drop" {...form.getInputProps("schedule")} />
            {form.values.schedule && (
              <DateTimePicker
                label="Scheduled Date and Time"
                minDate={new Date()}
                maxDate={form.values.expirationDateTime}
                placeholder="Pick Schedule Date and Time"
                {...form.getInputProps("scheduleDateTime")}
              />
            )}
            <Flex justify={"space-between"} gap="md">
              <Button primary={false} onClick={generateOffers} style={{ flex: 1 }}>
                Generate Offer
              </Button>
              <Button loading={loading} style={{ flex: 1 }} type={"submit"} disabled={!form.values.locations.length}>
                Drop Offer
              </Button>
            </Flex>
          </Stack>
        </form>
      </Flex>
    </Box>
  );
};

export default Drop;
