import {
  ActionIcon,
  Box,
  Button,
  Group,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { IconCirclePlus, IconPencil, IconTrash } from "@tabler/icons-react";
import { Listitem, Tabs } from "../../../common/type/types";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useFirebaseApp } from "../../../common/provider/firebaseProvider.tsx";
import DeleteModal from "../../modals/deleteModal/deleteModal.tsx";
import ItemModal from "../../modals/newItemModal/itemModal.tsx";

interface Props {
  list: Listitem[];
  path: Tabs;
}
const List = ({ list, path }: Props) => {
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [
    newItemModalOpened,
    { open: openNewItemModal, close: closeNewItemModal },
  ] = useDisclosure(false);
  const [
    updateItemModalOpened,
    { open: openUpdateItemModal, close: closeUpdateItemModal },
  ] = useDisclosure(false);
  const [elementToDelete, setElementToDelete] = useState<Listitem>();
  const [elementToUpdate, setElementToUpdate] = useState<Listitem>();
  const { deleteStorageItem, addItemStorage, updateStorageItem } =
    useFirebaseApp();

  return (
    <>
      <ItemModal
        title={
          <Text fz={24} fw={600}>
            Modifica
          </Text>
        }
        defaultValue={elementToUpdate}
        opened={updateItemModalOpened}
        onClose={closeUpdateItemModal}
        onConfirm={(item) => updateStorageItem(item, path)}
      />
      <ItemModal
        title={
          <Text fz={24} fw={600}>
            Aggiungi
          </Text>
        }
        opened={newItemModalOpened}
        onClose={closeNewItemModal}
        onConfirm={(item) => addItemStorage(item, path)}
      />
      <DeleteModal
        title={
          <Text fz={24} fw={600}>
            Elimina {elementToDelete?.name}
          </Text>
        }
        onConfirm={() => {
          if (elementToDelete) deleteStorageItem(elementToDelete, path);
        }}
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        elementToDelete={elementToDelete?.name ?? ""}
      />
      <Paper radius={8} py={8} px={6} bg={"white"}>
        <Group>
          <Title w={100} order={6}>
            Nome:
          </Title>
          <Title ta={"right"} w={70} order={6}>
            Quantità:
          </Title>
        </Group>
      </Paper>
      <Paper
        display={"flex"}
        style={{ flexDirection: "column", overflow: "hidden" }}
        flex={1}
        radius={8}
        mt={8}
        bg={"white"}
      >
        {list.length === 0 && (
          <Group px={8} pt={10} gap={8} wrap={"nowrap"}>
            <IconCirclePlus
              size={58}
              stroke={1}
              color={"var(--mantine-color-gray-7)"}
            />
            <Text c={"gray.7"} fw={600}>
              Aggiungi un elemento premendo il tasto qui sotto
            </Text>
          </Group>
        )}
        <Box flex={1} style={{ overflow: "auto" }}>
          {list.map(({ name, unit = "", number, id }) => {
            return (
              <Group
                mx={6}
                key={id}
                style={{ borderBottom: "1px solid var(--mantine-color-dark-1" }}
                py={4}
              >
                <Text w={100} fz={12}>
                  {name}
                </Text>
                <Text ta={"right"} w={70} fz={12}>
                  {number + unit}
                </Text>
                <Group style={{ flexGrow: 1 }} justify={"flex-end"} gap={6}>
                  <ActionIcon
                    onClick={() => {
                      setElementToUpdate({ id, name, number, unit });
                      openUpdateItemModal();
                    }}
                    color={"blue"}
                    variant={"light"}
                  >
                    <IconPencil />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => {
                      setElementToDelete({ id, name, number, unit });
                      openDeleteModal();
                    }}
                    color={"red"}
                    variant={"light"}
                  >
                    <IconTrash />
                  </ActionIcon>
                </Group>
              </Group>
            );
          })}
        </Box>
        <Group p={8} justify={"flex-end"}>
          <Button color={"blue"} onClick={() => openNewItemModal()}>
            Aggiungi
          </Button>
        </Group>
      </Paper>
    </>
  );
};

export default List;
