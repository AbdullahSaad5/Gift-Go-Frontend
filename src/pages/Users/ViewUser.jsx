import { Badge, Flex, Image, SimpleGrid, Text } from "@mantine/core";
import React from "react";

const ViewUser = ({ data }) => {
  return (
    <Flex direction={"column"} align="center" w={"100%"} p={"md"}>
      <Image
        src={data?.avatar || "/default-avatar.png"}
        fit="cover"
        styles={{
          root: {
            borderRadius: "50%",
            overflow: "hidden",
            border: `1px solid gray`,
            width: 200,
            height: 200,
          },
        }}
      />
      <Text
        fw={"bold"}
        color={"black"}
        fz="xl"
        my={"md"}
        ta={"center"}
        style={{
          wordBreak: "break-all",
        }}
      >
        {data.fullName}
      </Text>
      <SimpleGrid cols={2}>
        <Text fw={"bold"} color={"black"}>
          User Type:{" "}
        </Text>
        <Text>{data.userType}</Text>
        <Text fw={"bold"} color={"black"}>
          Email:{" "}
        </Text>
        <Text
          style={{
            wordBreak: "break-all",
          }}
        >
          {data.email}
        </Text>
        <Text fw={"bold"} color={"black"}>
          Phone No:{" "}
        </Text>
        <Text>{data.phone}</Text>

        <Text fw={"bold"} color={"black"}>
          Location:{" "}
        </Text>
        <Text>{data.address || "N/A"}</Text>

        <Text fw={"bold"} color={"black"}>
          Status:{" "}
        </Text>
        <Badge w={"100px"} color={data?.status === "Blocked" ? "red" : "green"}>
          {data?.status}
        </Badge>
      </SimpleGrid>
    </Flex>
  );
};

export default ViewUser;
