import {
  Box,
  Divider,
  Flex,
  Paper,
  ScrollArea,
  Select,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useFirebaseApp } from "../../../common/provider/firebaseProvider.tsx";
import { useEffect, useState } from "react";
import { Product } from "../../../common/type/types";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { currencyFormatter } from "../../../common/util/formatters.ts";
import { DateTime } from "luxon";

const CashFlow = () => {
  const [allDocs, setAllDocs] = useState<{
    [x: string]: QueryDocumentSnapshot<DocumentData, DocumentData>;
  }>({});
  const [days, setDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [product, setProduct] = useState<Product[]>([]);
  const { getCashflow, getCashflowData } = useFirebaseApp();
  const total = product.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);

  useEffect(() => {
    getCashflow().then((res) => {
      setDays(Object.keys(res));
      setAllDocs(res);
    });
  }, []);

  return (
    <Paper radius={8} h={"100%"} px={6}>
      <Select
        label={"Seleziona il giorno dell'incasso"}
        placeholder={"12/01/2025"}
        data={days.map((day) => ({
          label: DateTime.fromISO(day).toFormat("dd/MM/yyyy"),
          value: day,
        }))}
        value={selectedDay}
        onChange={(e) => {
          setSelectedDay(e);
          if (e)
            getCashflowData(allDocs[e]).then((res) => {
              setProduct(res);
            });
        }}
      />
      {product?.length ? (
        <>
          {" "}
          <ScrollArea h={300}>
            <Table.ScrollContainer minWidth={300}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nome</Table.Th>
                    <Table.Th>Venduto</Table.Th>
                    <Table.Th>Incasso</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {product?.map(({ id, label, price, quantity }) => (
                    <Table.Tr key={id}>
                      <Table.Td>{label}</Table.Td>
                      <Table.Td>{quantity}</Table.Td>
                      <Table.Td>{currencyFormatter(quantity * price)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </ScrollArea>
          <Divider my={12} />
          <Title order={4}>Totale: {currencyFormatter(total)}</Title>
        </>
      ) : (
        <Flex my={12} justify={"center"}>
          <Box>
            <Text>Non c'è nessun incasso da mostrare</Text>
            <Text>Prova a selezionare un altro giorno</Text>
          </Box>
        </Flex>
      )}
    </Paper>
  );
};

export default CashFlow;
