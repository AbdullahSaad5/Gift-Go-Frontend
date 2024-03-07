import { Group, Image } from "@mantine/core";
import { useState } from "react";
import { HoverCard } from "@mantine/core";

const TableImageView = ({ src }) => {
  return (
    <Group position="center" mr={"sm"}>
      <HoverCard shadow="md" openDelay={250} withinPortal>
        <HoverCard.Target width={40}>
          <img
            src={src || "/default-avatar.png"}
            height={40}
            width={40}
            alt="Table Image"
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          />
        </HoverCard.Target>
        <HoverCard.Dropdown display={!src && "none"}>
          <Image src={src} fit="cover" width={300} height={300} />
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
};

export default TableImageView;
