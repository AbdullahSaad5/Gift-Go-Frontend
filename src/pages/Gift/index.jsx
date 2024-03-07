import { Box, Center, Checkbox, Flex, LoadingOverlay, Stack } from "@mantine/core";
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
import ImageUpload from "../../components/general/ImageUpload";
import TextArea from "../../components/general/TextArea";
import { uploadFile } from "../../utils/upload-file";

const Gift = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const location = useLocation();
  const edit = location.state?.data;
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

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      company: user?.userType === "Admin" ? "" : user?.companyId,
      giftName: "",
      giftCategory: "",
      giftDescription: "",
      giftImage: null,
    },
    validate: {
      company: (value) => !value && "Company is required",
      giftName: (value) =>
        !value
          ? "Gift Name is required"
          : value.length < 3
          ? "Gift Name is too short"
          : value.length > 50
          ? "Gift Name is too long"
          : null,
      giftCategory: (value) => !value && "Gift Category is required",
      giftDescription: (value) =>
        !value
          ? "Gift Description is required"
          : value.length < 3
          ? "Gift Description is too short"
          : value.length > 200
          ? "Gift Description is too long"
          : null,
      giftImage: (value) => !value && "Gift Image is required",
    },
  });

  useEffect(() => {
    if (location.state?.data) {
      let company = location.state.data.company._id;
      form.setValues({
        ...location.state.data,
        company,
      });
    }
  }, [location.state]);

  const handleAddDrop = useMutation(
    async (values) => {
      const data = { ...values };

      const imageURL = await uploadFile(data.giftImage, "gifts-images");

      data.giftImage = imageURL;

      if (user.userType === "Company") data.company = user._id;
      if (edit) {
        return axios.patch(backendUrl + `/gifts/${edit._id}`, data, {
          headers: {
            authorization: `${user.accessToken}`,
          },
        });
      }

      return axios.post(backendUrl + `/gifts`, data, {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (response) => {
        toast.success(response.data.message);
        form.reset();
        navigate("/gifts");
      },
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    }
  );

  return (
    <Box>
      <PageHeader
        title={(edit ? "Edit" : "Add") + " Gift"}
        subTitle={(edit ? "Edit" : "Add") + " a gift for your drop"}
      />

      <Flex gap="lg" wrap={{ base: "wrap", lg: "nowrap" }}>
        <form style={{ flex: 1 }} onSubmit={form.onSubmit((values) => handleAddDrop.mutate(values))}>
          <Stack
            miw={320}
            style={{
              position: "relative",
            }}
          >
            <LoadingOverlay visible={isLoading || isFetching} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            {user?.userType === "Admin" && (
              <SelectMenu
                label={"Select Company"}
                withAsterisk
                form={form}
                searchable
                data={data?.data?.data?.map((obj) => {
                  return { value: obj._id, label: obj.fullName };
                })}
                validateName="company"
              />
            )}
            <InputField label={"Gift Name"} withAsterisk form={form} validateName="giftName" maxLength={51} />

            <SelectMenu
              label={"Select Gift Category"}
              withAsterisk
              form={form}
              searchable
              data={["Silver", "Gold", "Platinum"]}
              validateName="giftCategory"
            />

            <TextArea
              label={"Enter Gift Description"}
              placeholder={"Enter Gift Description   e.g. Full Product, 50% off coupon etc."}
              withAsterisk
              form={form}
              validateName="giftDescription"
              rows={3}
              maxLength={201}
            />
            <Center>
              <ImageUpload form={form} name="giftImage" />
            </Center>

            <Center>
              <Button type="submit" loading={handleAddDrop.isLoading} disabled={handleAddDrop.isLoading}>
                {edit ? "Edit" : "Add"} Gift
              </Button>
            </Center>
          </Stack>
        </form>
      </Flex>
    </Box>
  );
};

export default Gift;
