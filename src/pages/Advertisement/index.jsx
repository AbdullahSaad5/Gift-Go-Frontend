import { Accordion, Box, Flex, Group, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import React, { useContext, useState } from "react";
import Button from "../../components/general/Button";
import PageHeader from "../../components/general/PageHeader";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { backendUrl } from "../../constants";
import axios from "axios";
import { UserContext } from "../../context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DataGrid from "../../components/general/Table";
import InputField from "../../components/general/InputField";
import { Columns } from "./TableHeader";
import ImageUpload from "../../components/general/ImageUpload";
import uuid from "react-uuid";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";

const Advertisements = () => {
  const queryClient = new useQueryClient();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { status, isFetching } = useQuery(
    "fetchAdvertisements",
    () => {
      return axios.get(backendUrl + "/advertisement", {
        headers: {
          authorization: `${user.accessToken}`,
        },
      });
    },
    {
      onSuccess: (res) => {
        const data = res.data.data;
        let newData = data.map((obj, ind) => {
          return { ...obj, serialNo: ind + 1 };
        });
        setData(newData);
        toast.dismiss();
      },
    }
  );

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      title: "",
      link: "",
      description: "",
    },

    validate: {
      title: (value) => (value?.length > 2 ? null : "Please enter title greater than 2 characters"),
      coverImage: (value) => (value ? null : "Please Upload Cover Image"),
      link: (value) => (value?.length > 0 ? null : "Please enter link greater than 0 characters"),
    },
  });
  const handleAddAdvertisement = useMutation(
    async (values) => {
      let coverImage = values.coverImage;
      console.log(coverImage);
      // upload image to firebase
      const storageRef = ref(storage, `advertisement/${uuid()}`);
      const uploadTask = uploadBytesResumable(storageRef, coverImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              toast.error("Upload is paused");
              console.log("Upload is paused");
              break;
            case "running":
              toast.loading(`Uploading Cover Image to Firebase`);
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          toast.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            values.coverImage = downloadURL;
            try {
              let response = await axios.post(backendUrl + `/advertisement`, values, {
                headers: {
                  authorization: `${user.accessToken}`,
                },
              });
              console.log(response);
              toast.success(response.data.message);
              queryClient.invalidateQueries("fetchAdvertisements");
              form.reset();
            } catch (err) {
              // delete image from firebase
              const imageRef = ref(storage, `${downloadURL}`);
              await deleteObject(imageRef)
                .then(() => {
                  console.log("Image deleted from firebase");
                })
                .catch(() => {
                  console.log("Error deleting image from firebase");
                });
              toast.dismiss();
              toast.error(err.response.data.message);
            }
          });
        }
      );
    },
    {
      onSuccess: (res) => {},
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    }
  );
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleAddAdvertisement.mutate(values);
      })}
    >
      <Stack w="100%">
        <PageHeader title={"Advertisements"} />
        <Accordion
          defaultValue="addAdvertisement"
          styles={{
            item: {
              // styles added to all items
              backgroundColor: "#fff",
              border: "1px solid #ededed",

              // styles added to expanded item
              "&[data-active]": {
                backgroundColor: "#ccc",
              },
            },
          }}
        >
          <Accordion.Item value="addAdvertisement">
            <Accordion.Control>
              <Title order={3}>Add Advertisement</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <TextInput label="Title" {...form.getInputProps("title")} size="md" />
              {/* <TextInput
                label="Advertisement Cover Image URL"
                {...form.getInputProps("coverImage")}
                size="md"
              /> */}
              <TextInput label="Advertisement Link" {...form.getInputProps("link")} size="md" />
              <TextInput label="Description" {...form.getInputProps("description")} size="md" />
              <ImageUpload form={form} name="coverImage" />
              <Group justify="flex-end" mt="lg">
                <Button label={"Cancel"} primary={false} onClick={() => navigate("/")} />
                <Button label={"Add"} type={"submit"} />
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Box px="md">
          <PageHeader title={"Advertisements Table"} subTitle={"View all Advertisements"} />
          <DataGrid data={data} columns={Columns} progressPending={status === "loading" || isFetching} />
        </Box>
      </Stack>
    </form>
  );
};

export default Advertisements;
