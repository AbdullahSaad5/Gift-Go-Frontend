import React, { useContext } from "react";
import Button from "../../components/general/Button";
import { Box, Modal, SimpleGrid, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import InputField from "../../components/general/InputField";
import { useMutation } from "react-query";
import { parse } from "papaparse";
import axios from "axios";
import { backendUrl } from "../../constants";
import { UserContext } from "../../context";
import toast from "react-hot-toast";

const ReceiveMoney = ({ row, type = "receive" }) => {
  const [opened, { open, close }] = useDisclosure();
  const form = useForm({
    initialValues: {
      amount: 0,
    },
    validate: {
      amount: (value) => (value < 0 ? "Amount cannot be negative" : value === 0 ? "Amount cannot be zero" : null),
    },
  });
  const { user } = useContext(UserContext);

  const receiveMoney = useMutation(
    async (values) => {
      return axios.patch(
        backendUrl + `/transactions/${type}-money/${row.id || row._id}`,
        {
          amount: values.amount,
        },
        {
          headers: {
            Authorization: `${user.accessToken}`,
          },
        }
      );
    },
    {
      onSuccess: (res) => {
        toast.success(`Money ${type === "waive" ? "Waived" : "Received"} Successfully`);
        close();
      },
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    }
  );

  return (
    <>
      <Button
        size="compact-md"
        fz="sm"
        onClick={() => {
          open();
        }}
        disabled={row?.moneyOwed === 0}
      >
        {type === "waive" ? "Waive" : "Receive"}
      </Button>
      <Modal
        size="sm"
        padding="md"
        opened={opened}
        centered
        onClose={() => {
          form.reset();
          close();
        }}
      >
        <form onSubmit={form.onSubmit((values) => receiveMoney.mutate(values))}>
          <Stack align="center" w={"100%"}>
            <SimpleGrid cols={2}>
              <Text fw={600}>Money Owed: </Text>
              <Text align="right">
                {row?.moneyOwed?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Text>
              <Text fw={600}>Money {type === "waive" ? "Waiving" : "Receiving"}: </Text>
              <Text align="right">
                {form.values.amount
                  ? parseFloat(form.values.amount).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  : "$0.00"}
              </Text>
              <Text fw={600}>Money Remaining: </Text>
              <Text align="right">
                {(row?.moneyOwed - form.values.amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Text>
            </SimpleGrid>
            <InputField
              size="sm"
              form={form}
              validateName="amount"
              label="Amount"
              type="number"
              w="100%"
              withAsterisk
            />
            <Button
              type="submit"
              size="sm"
              disabled={form.values.amount == 0 || form.values.amount < 0 || form.values.amount > row?.moneyOwed}
              loading={receiveMoney.isLoading}
            >
              {type === "waive" ? "Waive" : "Receive"}
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default ReceiveMoney;
