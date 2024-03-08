import React, { useContext, useEffect } from "react";
import PageHeader from "../../components/general/PageHeader";
import { Group, Stack } from "@mantine/core";
import InputField from "../../components/general/InputField";
import Button from "../../components/general/Button";
import { useForm } from "@mantine/form";
import { UserContext } from "../../context";
import { useMutation } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    form.setInitialValues({
      fullName: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
    });
  }, [user]);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      fullName: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
    },

    validate: {
      fullName: (value) =>
        !value?.length
          ? "Enter Full Name"
          : value.length > 40
          ? "Name too long"
          : !/^[a-zA-Z\s]*$/.test(value)
          ? "Name should contain only alphabets"
          : null,
      phone: (value) => (!value?.length ? "Enter Phone" : !/^[0-9]*$/.test(value) ? "Invalid Phone" : null),
      address: (value) =>
        user?.userType !== "Company" && !value?.length
          ? null
          : value?.length > 100
          ? "Address too long"
          : value?.length < 10
          ? "Address too short"
          : !/^[a-zA-Z0-9\s]*$/.test(value)
          ? "Address should contain only alphabets and numbers"
          : "Address is required",
    },
  });

  const handleEditProfile = useMutation(
    async (values) => {
      return axios.patch(backendUrl + `/auth/edit-profile`, values, {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (res) => {
        toast.success(res.data.message);
        const accessToken = JSON.parse(localStorage.getItem("user")).accessToken;
        const newData = { ...res.data.data.user, accessToken };
        localStorage.setItem("user", JSON.stringify(newData));
      },
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    }
  );

  return (
    <form onSubmit={form.onSubmit((values) => handleEditProfile.mutate(values))}>
      <PageHeader title={"Update Profile"} subTitle={"Update your profile"} />
      <Stack>
        <InputField label="Full Name" form={form} validateName={"fullName"} size="md" />
        <InputField label="Email" form={form} validateName={"email"} size="md" disabled={true} />
        <InputField label="Phone" form={form} validateName={"phone"} size="md" />
        <InputField label="Address" form={form} validateName={"address"} size="md" />
      </Stack>
      <Group justify="flex-end" mt="lg">
        <Button label={"Cancel"} primary={false} onClick={() => navigate("/")} />
        <Button label={"Update"} type={"submit"} />
      </Group>
    </form>
  );
};

export default Profile;
