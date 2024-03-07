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
import PieChart from "../../components/general/Charts/PieChart";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const { status, data } = useQuery(
    ["fetchStats", user.userType],
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
      <SimpleGrid cols={3} spacing={"xl"}>
        {user.userType === "Admin" && <Card title={"Total Users"} value={data?.data?.data?.totalUsers} />}
        {user.userType === "Admin" && <Card title={"Total Companies"} value={data?.data?.data?.totalCompanies} />}
        <Card title="Total Drops" value={data?.data?.data?.totalDrops} />
        <Card title="Scanned Drops" value={data?.data?.data?.scannedDrops} />
        <Card title="Rewards Requested" value={data?.data?.data?.rewardRequested} />
        <Card title="Rewards Delivered" value={data?.data?.data?.rewardsDelivered} />
      </SimpleGrid>

      <SimpleGrid cols={2} mt={40}>
        <PieChart
          title="Gifts By Type"
          data={Object.values(data?.data?.data?.giftsByType ?? {}).map((a) => a)}
          labels={Object.keys(data?.data?.data?.giftsByType ?? {})}
        />
        <PieChart
          title="Drops By Status"
          data={Object.values(data?.data?.data?.dropsByStatus ?? {}).map((a) => a)}
          labels={Object.keys(data?.data?.data?.dropsByStatus ?? {})}
        />
      </SimpleGrid>
    </Box>
  );
};
export default Dashboard;
