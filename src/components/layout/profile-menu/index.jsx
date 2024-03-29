import { Menu, Text, Avatar, Group, Stack } from "@mantine/core";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../context";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Group className={styles["menu-trigger-avatar"]}>
          <Stack gap={0}>
            <Text visibleFrom="xs" c="black" fw={600}>
              {user.name}
            </Text>
            <Text visibleFrom="sm" c="black" fw={500} fz={"xs"}>
              {user.email}
            </Text>
          </Stack>
          <Avatar src={user.avatar || "/default-avatar.png"} variant="outline" />
        </Group>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => {
            navigate("/settings");
          }}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          c="red"
          onClick={() => {
            setUser(null);
            localStorage.clear();
            navigate("/signin");
          }}
        >
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
