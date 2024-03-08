import { Box, Group, PasswordInput, Stack, Tabs } from "@mantine/core";
import React, { useContext } from "react";
import Button from "../../components/general/Button";
import PageHeader from "../../components/general/PageHeader";
import { useForm } from "@mantine/form";
import { useMutation } from "react-query";
import { backendUrl } from "../../constants";
import axios from "axios";
import { UserContext } from "../../context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/general/InputField";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";

const Settings = () => {
  return (
    <Tabs defaultValue="edit-profile">
      <Tabs.List mb={"xl"}>
        <Tabs.Tab value="edit-profile">Profile</Tabs.Tab>
        <Tabs.Tab value="password">Change Password</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="edit-profile">
        <Profile />
      </Tabs.Panel>
      <Tabs.Panel value="password">
        <ChangePassword />
      </Tabs.Panel>
    </Tabs>
  );
};

export default Settings;
