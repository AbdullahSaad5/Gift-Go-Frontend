import { FileInput, Flex, Group, Modal, SimpleGrid, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Password, Photo } from "tabler-icons-react";
import Button from "../../components/general/Button";
import InputField from "../../components/general/InputField";
import { backendUrl } from "../../constants";
import { UserContext } from "../../context";
import SelectMenu from "../../components/general/SelectMenu";
import ImageUpload from "../../components/general/ImageUpload";
import PasswordField from "../../components/general/PasswordField";
import { uploadFile } from "../../utils/upload-file";

const AddCompany = ({ opened, open, close, editData }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const form = useForm({
    initialValues: {
      fullName: "",
      logo: null,
      description: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      fullName: (value) => (value?.length > 0 ? null : "Enter Company Name"),
      email: (value) => (value?.length > 0 ? null : "Enter Email"),
      phone: (value) => (value?.length > 0 ? null : "Enter Phone"),
      userType: (value) => (value?.length > 0 ? null : "Select User Type"),
      password: (value) => (value?.length > 0 ? null : "Enter Password"),
      confirmPassword: (value) => (value === form.values.password ? null : "Password does not match"),
    },
  });

  useEffect(() => {
    if (editData) form.setValues(editData);
  }, [editData]);

  const handleAddCompany = useMutation(
    async (values) => {
      const url = await uploadFile(values.logo, "user-avatars");
      values = { ...values, avatar: url };
      if (editData) {
        return axios.patch(backendUrl + `/companies/${editData._id}`, values, {
          headers: {
            authorization: `${user.accessToken}`,
          },
        });
      }
      return axios.post(backendUrl + `/users`, values, {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (response) => {
        toast.success(response.data.message);
        form.reset();
        close();
        queryClient.invalidateQueries("fetchCompanies");
      },
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    }
  );
  return (
    <Modal
      opened={opened}
      title="Add New User"
      centered
      withCloseButton={false}
      onClose={() => {
        form.clearErrors();
        close();
      }}
      size={"xl"}
      styles={{ title: { margin: "auto", fontWeight: "600" } }}
    >
      <form onSubmit={form.onSubmit((values) => handleAddCompany.mutate(values))}>
        <SimpleGrid cols={2}>
          <SelectMenu
            label="User Type"
            placeholder="Select User Type"
            data={["User", "Company", "Admin"]}
            searchable
            form={form}
            validateName={"userType"}
          />
          <InputField label={"Name"} form={form} validateName={"fullName"} />
          <InputField label={"Email"} form={form} validateName={"email"} />
          <InputField label={"Phone"} form={form} validateName={"phone"} />
          <PasswordField label={"Password"} form={form} validateName={"password"} />
          <PasswordField label={"Confirm Password"} form={form} validateName={"confirmPassword"} />
          {/* <FileInput
            label="Logo"
            size="md"
            placeholder="Upload JPG/PNG image"
            radius={"md"}
            leftSection={<Photo width={30} />}
            {...form.getInputProps("logo")}
          /> */}
        </SimpleGrid>
        <Textarea
          label="Description"
          radius={"md"}
          mt="sm"
          size="md"
          autosize
          minRows={2}
          maxRows={4}
          placeholder="Description"
          {...form.getInputProps("description")}
        />
        <Flex direction={"column"} align={"center"} mt={"md"}>
          <ImageUpload form={form} name="logo" />
        </Flex>
        <Group justify="center" mt="md">
          <Button
            label={"Cancel"}
            primary={false}
            onClick={() => {
              close();
              form.reset();
              setEditData(null);
            }}
          />
          <Button label={editData ? "Update" : "Add"} type={"submit"} />
        </Group>
      </form>
    </Modal>
  );
};

export default AddCompany;
