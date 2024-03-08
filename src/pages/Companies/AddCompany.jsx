import { FileInput, Flex, Group, Modal, SimpleGrid, Textarea, em } from "@mantine/core";
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
    validateInputOnChange: true,
    initialValues: {
      userType: "",
      fullName: "",
      logo: null,
      address: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      goldPrice: "",
      silverPrice: "",
      platinumPrice: "",
    },

    validate: {
      userType: (value) => !value?.length && "Select User Type",
      fullName: (value) =>
        !value?.length
          ? "Enter Full Name"
          : value.length > 40
          ? "Name too long"
          : !/^[a-zA-Z\s]*$/.test(value)
          ? "Name should contain only alphabets"
          : null,
      email: (value) =>
        !value?.length
          ? "Enter Email"
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid Email"
          : value.length > 80
          ? "Email too long"
          : null,
      phone: (value) => (!value?.length ? "Enter Phone" : !/^[0-9]*$/.test(value) ? "Invalid Phone" : null),
      userType: (value) => !value?.length && "Select User Type",
      password: (value) =>
        !value?.length
          ? "Enter Password"
          : value.length < 8
          ? "Password too short"
          : value.length > 32
          ? "Password too long"
          : null,
      confirmPassword: (value, values) =>
        !value?.length ? "Enter Confirm Password" : value !== values.password ? "Password does not match" : null,
      address: (value, values) =>
        values?.userType !== "Company" && !value?.length
          ? null
          : value?.length > 100
          ? "Address too long"
          : value?.length < 10
          ? "Address too short"
          : !/^[a-zA-Z0-9\s]*$/.test(value)
          ? "Address should contain only alphabets and numbers"
          : null,
      silverPrice: (value, values) =>
        values?.userType !== "Company" && !value?.length
          ? "Enter Silver Price"
          : value?.length > 9
          ? "Price too long"
          : value?.length < 1
          ? "Price too short"
          : !/^[0-9]*$/.test(value)
          ? "Invalid Price"
          : null,
      goldPrice: (value, values) =>
        values?.userType !== "Company" && !value?.length
          ? "Enter Gold Price"
          : value?.length > 9
          ? "Price too long"
          : value?.length < 1
          ? "Price too short"
          : !/^[0-9]*$/.test(value)
          ? "Invalid Price"
          : null,
      platinumPrice: (value, values) =>
        values?.userType !== "Company" && !value?.length
          ? "Enter Platinum Price"
          : value?.length > 9
          ? "Price too long"
          : value?.length < 1
          ? "Price too short"
          : !/^[0-9]*$/.test(value)
          ? "Invalid Price"
          : null,
    },
  });

  console.log(form.values);

  useEffect(() => {
    if (editData) form.setValues(editData);
  }, [editData]);

  const handleAddCompany = useMutation(
    async (values) => {
      const url = await uploadFile(values.logo, "user-avatars");
      values = { ...values, avatar: url };

      if (values.userType === "Company") {
        const moneyByDropCategory = {
          Silver: isNaN(parseFloat(values.silverPrice)) ? 0 : parseFloat(values.silverPrice),
          Gold: isNaN(parseFloat(values.goldPrice)) ? 0 : parseFloat(values.goldPrice),
          Platinum: isNaN(parseFloat(values.platinumPrice)) ? 0 : parseFloat(values.platinumPrice),
        };
        values = { ...values, moneyByDropCategory };

        delete values.silverPrice;
        delete values.goldPrice;
        delete values.platinumPrice;
      }

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
            withAsterisk
            autofill="off"
          />
          <InputField label={"Name"} form={form} validateName={"fullName"} maxLength={41} withAsterisk />
          <InputField label={"Email"} form={form} validateName={"email"} maxLength={80} withAsterisk />
          <InputField label={"Phone"} form={form} validateName={"phone"} maxLength={20} withAsterisk />
          <PasswordField label={"Password"} form={form} validateName={"password"} maxLength={33} withAsterisk />
          <PasswordField
            label={"Confirm Password"}
            form={form}
            validateName={"confirmPassword"}
            maxLength={33}
            withAsterisk
          />
        </SimpleGrid>
        <Textarea
          label="Enter Address"
          radius={"md"}
          mt="sm"
          size="md"
          autosize
          minRows={2}
          maxRows={4}
          placeholder="Enter Address"
          {...form.getInputProps("address")}
        />
        {form.values.userType === "Company" && (
          <Group mt={"md"}>
            <InputField
              label={"Silver Price ($)"}
              form={form}
              validateName={"silverPrice"}
              maxLength={10}
              withAsterisk
              type="number"
            />
            <InputField
              label={"Gold Price ($)"}
              form={form}
              validateName={"goldPrice"}
              maxLength={10}
              withAsterisk
              type="number"
            />
            <InputField
              label={"Platinum Price ($)"}
              form={form}
              validateName={"platinumPrice"}
              maxLength={10}
              withAsterisk
              type="number"
            />
          </Group>
        )}
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
          <Button loading={handleAddCompany.isLoading} label={editData ? "Update" : "Add"} type={"submit"} />
        </Group>
      </form>
    </Modal>
  );
};

export default AddCompany;
