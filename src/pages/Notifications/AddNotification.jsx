import { Flex, Group, LoadingOverlay, Modal, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Button from "../../components/general/Button";
import InputField from "../../components/general/InputField";
import { backendUrl } from "../../constants";
import { UserContext } from "../../context";
import SelectMenu from "../../components/general/SelectMenu";
import ImageUpload from "../../components/general/ImageUpload";
import toast from "react-hot-toast";

const AddNotification = ({ opened, open, close, editData }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      company: user?.userType === "Company" ? user._id : "",
      message: "",
    },

    validate: {
      company: (value) => !value?.length && "Select Company",
      message: (value) =>
        !value?.length
          ? "Enter Message"
          : !value.trim().length
          ? "Message cannot be empty"
          : value.length > 300
          ? "Message too long"
          : value.length < 10
          ? "Message too short"
          : null,
    },
  });

  useEffect(() => {
    if (editData) form.setValues(editData);
  }, [editData]);

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

  const handleAddNotification = useMutation(
    (values) => {
      if (user?.userType === "Company") values.company = user._id;
      return axios.post(backendUrl + "/notifications", values, {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (response, values) => {
        toast.success(response.data.message);
        const oldData = queryClient.getQueryData("fetchNotifications").data.data;
        const newData = [...oldData, values];
        queryClient.setQueryData("fetchNotifications", { data: { data: newData } });
        queryClient.invalidateQueries("fetchNotifications");
        close();
        form.reset();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  return (
    <Modal
      opened={opened}
      title="Add New Notification"
      centered
      withCloseButton={false}
      onClose={() => {
        form.clearErrors();
        close();
      }}
      size={"xl"}
      styles={{ title: { margin: "auto", fontWeight: "600", position: "relative" } }}
    >
      <LoadingOverlay visible={isLoading || isFetching} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <form onSubmit={form.onSubmit((values) => handleAddNotification.mutate(values))}>
        <Stack>
          <SelectMenu
            label="Company"
            placeholder="Select Company"
            data={data?.data?.data?.map((obj) => {
              return { value: obj._id, label: obj.fullName };
            })}
            form={form}
            validateName={"company"}
            withAsterisk
            autofill="off"
            disabled={user?.userType === "Company"}
          />
          <Textarea
            label="Notification Message"
            withAsterisk
            radius={"md"}
            mt="sm"
            size="md"
            autosize
            minRows={5}
            maxRows={5}
            placeholder="Enter Notification Message"
            maxLength={301}
            {...form.getInputProps("message")}
          />
          <Group justify="center">
            <Button
              label={"Cancel"}
              primary={false}
              onClick={() => {
                close();
                form.reset();
              }}
              loading={handleAddNotification.isLoading}
            />
            <Button label={editData ? "Update" : "Add"} type={"submit"} loading={handleAddNotification.isLoading} />
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddNotification;
