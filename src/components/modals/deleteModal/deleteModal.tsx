import { Button, Flex, Modal, ModalProps, Space, Text } from "@mantine/core";

const DeleteModal = (
  props: ModalProps & { elementToDelete: string; onConfirm: () => void },
) => {
  const { elementToDelete, onConfirm, ...others } = props;

  return (
    <Modal
      {...others}
      radius={12}
      overlayProps={{
        blur: 2,
      }}
    >
      <Text>Sicuro di voler eliminare {elementToDelete}?</Text>
      <Space h={20} />
      <Flex justify={"space-evenly"}>
        <Button onClick={others.onClose} color={"blue"}>
          Annulla
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            others.onClose();
          }}
          color={"red"}
          variant={"outline"}
        >
          Elimina
        </Button>
      </Flex>
    </Modal>
  );
};

export default DeleteModal;
