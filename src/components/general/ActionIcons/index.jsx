import { ActionIcon, Flex, Modal, Tooltip } from "@mantine/core";
import React, { useState } from "react";
// import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, PencilOff, Trash, TrashOff } from "tabler-icons-react";
import DeleteModal from "../DeleteModal";
import { useMutation, useQueryClient } from "react-query";
import { backendUrl } from "../../../constants";
import toast from "react-hot-toast";
import axios from "axios";
import { useDisclosure } from "@mantine/hooks";

const ActionIcons = ({ type, edit = false, view, del, rowData, viewData, blocked, viewSize = "lg" }) => {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure();
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const handleDelete = useMutation(
    async () => {
      let link = backendUrl + `/${type.toLowerCase()}/${rowData._id}`;
      if (type === "drops") link = backendUrl + `/${type.toLowerCase()}/get-specific/${rowData._id}`;
      else if (type === "Coupons-group") link = backendUrl + `/coupons/delete-group/${rowData._id}`;
      return axios.delete(link, {
        headers: {
          authorization: user.accessToken,
        },
      });
    },
    {
      onSuccess: (res) => {
        setOpenDelete(false);
        toast.success(res.data.message);
        if (type === "Users") queryClient.invalidateQueries("fetchUsers");
        if (type === "gifts") queryClient.invalidateQueries("fetchGifts");
        else if (type === "Companies") queryClient.invalidateQueries("fetchCompanies");
        else if (type === "Coupons") queryClient.invalidateQueries("fetchCoupons");
        else if (type === "drops") queryClient.invalidateQueries("fetchDrops");
        else if (type === "tutorial") queryClient.invalidateQueries("fetchTutorials");
        else if (type === "advertisement") queryClient.invalidateQueries("fetchAdvertisements");
      },
      onError: (res) => {
        toast.error(res.response.data.message);
        setOpenDelete(false);
      },
    }
  );
  return (
    <Flex gap={5}>
      {edit && (
        <Tooltip label="Edit">
          <ActionIcon
            disabled={blocked}
            bg="white"
            onClick={() => {
              let link;
              if (type === "gifts") {
                link = `/add-gift`;
              }

              navigate(link, { state: { data: rowData } });
            }}
          >
            {blocked ? <PencilOff /> : <Pencil stroke={"gray"} />}
          </ActionIcon>
        </Tooltip>
      )}
      {view && (
        <Tooltip label="View">
          <ActionIcon
            bg="white"
            onClick={() => {
              open();
            }}
          >
            <Eye stroke="gray" />
          </ActionIcon>
        </Tooltip>
      )}
      {del && (
        <Tooltip label="Delete">
          <ActionIcon disabled={blocked} bg="white" onClick={() => setOpenDelete(true)}>
            {blocked ? <TrashOff /> : <Trash stroke={"gray"} />}
          </ActionIcon>
        </Tooltip>
      )}

      <Modal opened={opened} title={`View ${type}`} onClose={close} centered>
        {viewData}
      </Modal>

      <DeleteModal
        label={`Delete Selected ${type}`}
        message={`Are you sure you want to delete this ${type}. This Action Cannot be undone.`}
        opened={openDelete}
        onDelete={() => handleDelete.mutate()}
        setOpened={setOpenDelete}
        loading={handleDelete.isLoading}
      />
    </Flex>
  );
};

export default ActionIcons;
