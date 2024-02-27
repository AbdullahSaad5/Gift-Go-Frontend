import { Box, Center, Group, Loader, SimpleGrid, Stack, Title } from "@mantine/core";
import React, { useContext, useState } from "react";
import PageHeader from "../../components/general/PageHeader";
import Card from "./Card";
import { useQuery } from "react-query";
import axios from "axios";
import Chart from "react-apexcharts";
import { backendUrl } from "../../constants";
import { UserContext } from "../../context";
import { Building2, CheckCircle2Icon, DropletIcon, Puzzle, TreePine, User2Icon } from "lucide-react";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const { status, data } = useQuery(
    "fetchStats",
    () => {
      return axios.get(backendUrl + "/dashboard", {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (res) => {},
    }
  );

  return (
    <Box h={"100%"}>
      <PageHeader title={"Statictics"} subTitle={"Overview your application statistics"} />
      <Group justify="space-between">
        {user.userType === "Admin" && (
          <Card title={"Total Users"} value={data?.data?.data?.totalUsers} icon={<User2Icon />} />
        )}
        <Card title="Total Active Drops" value={data?.data?.data?.totalDrops} icon={<DropletIcon />} />
        <Card title="Total Claimed Drops" value={data?.data?.data?.claimedDrops} icon={<CheckCircle2Icon />} />
      </Group>
    </Box>
  );
};

export default Dashboard;
