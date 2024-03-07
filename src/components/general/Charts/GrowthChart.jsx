import { Box, Card, Group, Loader, Select, useMantineTheme } from "@mantine/core";
import axios from "axios";
import React from "react";
import Chart from "react-apexcharts";
import { useQuery } from "react-query";
import { backendUrl } from "../../../constants";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { statsCardsAllowedUserTypes } from "../../../pages/Seller/Dashboard/statsCardsAllowedUserTypes";

export default function GrowthChart() {
  const [chartData, setChartData] = React.useState(null);
  const theme = useMantineTheme();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [labels, setLabels] = React.useState(days);

  const { user } = useContext(UserContext);

  const [selected, setSelected] = React.useState("daily");
  const [value, setValue] = useState([new Date(new Date().setDate(new Date().getDate() - 7)), new Date()]);

  const [series, setSeries] = React.useState(
    user.userType === "Customer"
      ? [
          { name: "Order", data: [0, 0, 0, 0, 0, 0, 0] },
          { name: "Payment", data: [0, 0, 0, 0, 0, 0, 0] },
          { name: "Complaint", data: [0, 0, 0, 0, 0, 0, 0] },
        ]
      : [
          { name: "Vehicle", data: [0, 0, 0, 0, 0, 0, 0] },
          { name: "Order", data: [0, 0, 0, 0, 0, 0, 0] },
          { name: "Payment", data: [0, 0, 0, 0, 0, 0, 0] },
          { name: "Complaint", data: [0, 0, 0, 0, 0, 0, 0] },
        ]
  );

  const seriesAllowedRights = {
    Vehicle: "manageVehicles",
    Order: "manageOrders",
    Payment: "managePayments",
    Complaint: "manageComplaints",
  };

  const { status, refetch, isFetching } = useQuery(
    "growthChart",
    () => {
      return axios.post(
        backendUrl + "/dashboard/get-growth-chart-data",
        {
          type: selected,
        },
        {
          headers: {
            Authorization: user.token,
          },
        }
      );
    },
    {
      onSuccess: (res) => {
        if (selected === "daily") {
          setLabels(res.data.data?.[0]?.data.map((a) => days[new Date(a._id).getDay()]));
        } else {
          setLabels(res.data.data?.[0]?.data.map((a) => a._id));
        }

        setSeries(
          res.data.data.map((a) => ({
            name: a.collection,
            data: a.data.map((b) => b.count),
            isAllowed:
              user?.rights[seriesAllowedRights[a.collection]] || statsCardsAllowedUserTypes.includes(user.userType),
          }))
        );
      },
      onError: (err) => {
        console.log(err);
        toast.error("Failed to fetch chart data.");
      },
      enabled: !!selected,
    }
  );

  React.useEffect(() => {
    refetch();
  }, [selected]);

  React.useEffect(() => {
    console.log("USE EFFECT");
    const timeout = setTimeout(() => {
      setChartData(options);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [selected, labels]);

  const options = {
    height: 500,
    type: "bar",
    options: {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
        },
      },
      xaxis: {
        type: "category",
        categories: labels,
      },
      legend: {
        show: true,
        fontSize: "14px",
        fontFamily: `'Roboto', sans-serif`,
        position: "bottom",
        offsetX: 20,
        labels: {
          useSeriesColors: false,
        },
        markers: {
          width: 20,
          height: 20,
          radius: 100,
        },
        itemMargin: {
          horizontal: 16,
          vertical: 8,
        },
      },
      fill: {
        type: "solid",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: true,
      },
      colors: ["#111111", "#F9A825", "#FFCA28", "#FFE082"],
      tooltip: {
        theme: theme.colorScheme,
      },
      chart: {
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
        foreColor: theme.colors.text.primary,
      },
    },
    series: series.filter((data) => data.isAllowed),
  };

  if (status === "loading" || isFetching) {
    return (
      <Box
        style={{
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Card
      style={{
        borderRadius: "5px",
        width: "100%",
        border: "1px solid rgb(255, 168, 3)",
        boxShadow: "0px 0px 10px rgb(255, 168, 3, 0.5)",
        height: "100%",
        position: "relative",
        marginTop: "10px",
      }}
    >
      {/* <Group position="center">
        <DatePicker
          type="range"
          numberOfColumns={2}
          value={value}
          onChange={setValue}
          maxDate={new Date()}
        />
      </Group> */}
      <Select
        placeholder="Pick one"
        defaultValue={"yearly"}
        value={selected}
        onChange={setSelected}
        data={[
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Within Month" },
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly" },
        ]}
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          zIndex: 1,
        }}
        styles={{
          input: {
            border: "none",
          },
        }}
      />
      {chartData ? <Chart {...chartData} width="100%" type={chartData ? chartData?.type : "bar"} /> : "Loading..."}
    </Card>
  );
}
