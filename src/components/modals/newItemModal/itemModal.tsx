import {
  Button,
  Flex,
  Modal,
  ModalProps,
  NumberInput,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { Group } from "@mantine/core";
import { Listitem } from "../../../common/type/types";
import { useState } from "react";
import { useShallowEffect } from "@mantine/hooks";

const ItemModal = (
  props: Omit<ModalProps, 'defaultValue'> & {
    onConfirm: (x: Listitem) => void;
    defaultValue?: Listitem;
  },
) => {
  const { onConfirm, defaultValue, ...others } = props;
  const [name, setName] = useState<string>(defaultValue?.name ?? "");
  const [unit, setUnit] = useState<string>(defaultValue?.unit ?? "");
  const [number, setNumber] = useState<number>(defaultValue?.number ?? 0);

  useShallowEffect(() => {
    if (defaultValue?.name) setName(defaultValue?.name ?? "");
    if (defaultValue?.unit) setUnit(defaultValue?.unit ?? "");
    if (defaultValue?.number) setNumber(defaultValue?.number ?? 0);
  }, [defaultValue]);

  return (
    <Modal
      {...others}
      radius={12}
      overlayProps={{
        blur: 2,
      }}
    >
      <Text>Aggiungi un elemento alla lista:</Text>
      <Space h={20} />
      <Group>
        <TextInput
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          label={"Nome"}
        />
        <NumberInput
          value={number}
          onChange={(e) => setNumber(+e)}
          label={"Quantità"}
          min={0}
        />
        <TextInput
          value={unit}
          onChange={(e) => setUnit(e.currentTarget.value)}
          label={"Unità di misura"}
          placeholder={"Pacchi, bottiglie..."}
        />
      </Group>
      <Flex justify={"flex-end"}>
        <Button
          onClick={() => {
            onConfirm({ name, unit, number, id: defaultValue?.id ?? "" });
            others.onClose();
          }}
          color={"blue"}
        >
          Invia
        </Button>
      </Flex>
    </Modal>
  );
};

export default ItemModal;
