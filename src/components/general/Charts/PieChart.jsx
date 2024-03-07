import { Card, Text, useMantineTheme } from "@mantine/core";
import React from "react";
import Chart from "react-apexcharts";

export default function PieChart({ data = [20, 10], title = "Total Feedback", labels = ["Pending", "Resolved"] }) {
  const [chartData, setChartData] = React.useState(null);
  const theme = useMantineTheme();
  React.useEffect(() => {
    setTimeout(() => {
      if (data.length === 0 || data.reduce((a, b) => a + b, 0) === 0) {
        setChartData({
          type: "pie",
          series: [1],
          height: 400,
          options: {
            labels: ["No Data Yet"],
            colors: ["#111111"],
            legend: {
              show: true,
              fontSize: "14px",
              fontFamily: `'Roboto', sans-serif`,
              position: "bottom",
              labels: {
                useSeriesColors: false,
              },
            },
            tooltip: { enabled: false },
          },
        });
      } else {
        setChartData({
          type: "pie",
          series: data,
          height: 400,
          options: {
            labels,
            colors: ["#85C08E", "#85C0BE", "#85C0FF", "#85C057"],
            legend: {
              show: true,
              fontSize: "14px",
              fontFamily: `'Roboto', sans-serif`,
              position: "bottom",
              labels: {
                useSeriesColors: false,
              },
            },
            tooltip: {
              theme: "#fff",
              enabled: true,
            },
          },
        });
      }
    }, 100);
  }, [data]);

  return (
    <Card
      style={{
        borderRadius: "5px",
        width: "100%",
        height: "100%",
      }}
    >
      <Text fz={"xl"} fw={"bold"} align="center">
        {title}
      </Text>
      {chartData ? <Chart {...chartData} width={"100%"} type={chartData ? chartData?.type : "pie"} /> : "Loading..."}
    </Card>
  );
}
