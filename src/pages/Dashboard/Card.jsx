import { Box, Flex, Text, Title } from "@mantine/core";
import React from "react";

const Card = ({ title, description, value, icon }) => {
  return (
    <Flex
      w={300}
      p={20}
      justify="space-between"
      direction={"column"}
      style={{
        borderLeft: "5px solid #85C0CE",
      }}
    >
      <Flex justify={"space-between"}>
        <Text>{title}</Text>
      </Flex>
      <Title>{value ?? "--"}</Title>
      <Text c="gray">{description}</Text>
    </Flex>
  );
};

export default Card;
