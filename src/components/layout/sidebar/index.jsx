import { Box, NavLink, Text } from "@mantine/core";
import {
  CalendarCheck,
  CheckCircle2Icon,
  DropletIcon,
  FileWarning,
  GaugeCircleIcon,
  Gift,
  GitPullRequestDraftIcon,
  HelpCircle,
  Settings,
  StarIcon,
  User2Icon,
} from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { UserContext } from "../../../context";
export default function Sidebar({ toggle }) {
  // State to keep track of active link
  const [active, setActive] = useState("Dashboard");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Sidebar Links
  const content = useMemo(() => {
    return [
      {
        label: "Dashboard",
        icon: <GaugeCircleIcon size={18} />,
        isLink: true,
        to: "/",
      },
      {
        label: "Offers",
        icon: <DropletIcon size={18} />,
        isLink: false,
        children: [
          {
            label: "Gifts",
            icon: <Gift size={18} />,
            to: "/gifts",
          },
          {
            label: "Drops",
            icon: <DropletIcon size={18} />,
            to: "/drop",
          },
          {
            label: "Scheduled",
            icon: <CalendarCheck size={18} />,
            to: "/scheduled",
          },
          {
            label: "Live",
            icon: <StarIcon size={18} />,
            to: "/live",
          },
          {
            label: "Drop-History",
            icon: <FileWarning size={18} />,
            to: "/drop-history",
          },
          {
            label: "Claimed Rewards",
            icon: <CheckCircle2Icon size={18} />,
            to: "/claimed",
          },
        ],
      },
      {
        label: "Reward Requests",
        icon: <User2Icon size={18} />,
        isLink: false,
        children: [
          {
            label: "Reward Requests",
            icon: <HelpCircle size={18} />,
            to: "/reward-requests",
          },
        ],
      },
      {
        label: "Players",
        icon: <User2Icon size={18} />,
        isLink: false,
        skip: true,
        children: [
          {
            label: "Users",
            icon: <User2Icon size={18} />,
            to: "/users",
          },
          {
            label: "Leaderboard",
            icon: <User2Icon size={18} />,
            to: "/leaderboard",
          },
        ],
      },
      {
        label: "Transactions",
        icon: <User2Icon size={18} />,
        isLink: false,
        skip: true,
        children: [
          {
            label: "Money Owed",
            icon: <User2Icon size={18} />,
            to: "/owed",
          },
        ],
      },
      {
        label: "Settings",
        icon: <Settings size={18} />,
        isLink: false,
        children: [
          {
            label: "Settings",
            icon: <Settings size={18} />,
            to: "/settings",
          },
        ],
      },
    ].filter((item) => {
      if (item.skip) {
        return user?.userType === "Admin";
      }
      return true;
    });
  }, [user?.userType]);

  return (
    <Box className={styles["sidebar-container"]}>
      {content.map((item, ind) => {
        // If the item is a link, return a NavLink component
        if (item.isLink) {
          return (
            <NavLink
              key={ind}
              className={styles["navlink"]}
              active={active === item.label}
              label={item.label}
              leftSection={item.icon}
              onClick={() => {
                navigate(item.to);
                setActive(item.label);
                toggle();
              }}
            />
          );
        } else {
          return (
            // If the item is not a link, return a Text component
            <Box key={ind}>
              <Text className={styles["sidebar-section-title"]} c="black" key={item.label}>
                {item.label}
              </Text>
              {item.children.map((child, i) => {
                return (
                  <NavLink
                    key={i}
                    className={styles["navlink"]}
                    label={child.label}
                    active={active === child.label}
                    leftSection={child.icon}
                    onClick={() => {
                      navigate(child.to);
                      setActive(child.label);
                      toggle();
                    }}
                  />
                );
              })}
            </Box>
          );
        }
      })}
    </Box>
  );
}
