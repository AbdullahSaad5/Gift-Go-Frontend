import { useForm } from "@mantine/form";
import React, { useContext } from "react";
import { useMutation } from "react-query";
import { backendUrl } from "../../constants";
import axios from "axios";
import toast from "react-hot-toast";
import { Group, PasswordInput, Stack } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import Button from "../../components/general/Button";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPass: "",
    },

    validate: {
      oldPassword: (value) => (value?.length > 0 ? null : "Please enter old password"),
      newPassword: (value) => (value?.length > 7 ? null : "Please enter new password containing at least 8 characters"),
      confirmPass: (value, values) =>
        value?.length > 0 && values?.newPassword === value ? null : "Please enter confirm password",
    },
  });
  const handleChangePassword = useMutation(
    async (values) => {
      return axios.patch(backendUrl + `/auth/change-password`, values, {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (res) => {
        toast.success(res.data.message);
        form.reset();
      },
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    }
  );
  return (
    <form onSubmit={form.onSubmit((values) => handleChangePassword.mutate(values))}>
      <Stack>
        <PageHeader title={"Change Password"} subTitle={"Update your password"} />
        <PasswordInput label="Old Password" {...form.getInputProps("oldPassword")} size="md" />
        <PasswordInput label="New Password" {...form.getInputProps("newPassword")} size="md" />
        <PasswordInput label="Confirm Password" {...form.getInputProps("confirmPass")} size="md" />
        <Group justify="flex-end" mt="lg">
          <Button label={"Cancel"} primary={false} onClick={() => navigate("/")} />
          <Button label={"Update"} type={"submit"} loading={handleChangePassword.isLoading} />
        </Group>
      </Stack>
    </form>
  );
};

export default ChangePassword;
