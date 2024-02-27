import { Box, Divider, Text, Title } from "@mantine/core";
import React from "react";

const PageHeader = ({ title, subTitle }) => {
  return (
    <>
      <Box
        pb={"md"}
        mb={"md"}
        style={{
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Title order={4}>{title}</Title>
        <Text fz={"sm"} c={"gray"}>
          {subTitle}
        </Text>
      </Box>
    </>
  );
};

export default PageHeader;
