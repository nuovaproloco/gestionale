import "./App.css";
import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Image,
  Paper,
  Space,
  Stack,
  Title,
} from "@mantine/core";
import logo from "./assets/logo_compatto_bianco.svg";
import { useEffect, useState } from "react";
import List from "./components/list/list.tsx";
import { useFirebaseApp } from "./common/provider/firebaseProvider.tsx";
import { Listitem } from "./common/type/types";
import { IconDoorExit } from "@tabler/icons-react";
import { useLocalStorage } from "@mantine/hooks";
import { getAuth, signOut } from "firebase/auth";

function App() {
  const [tabSelected, setTabSelected] = useState<"magazzino" | "carrello">(
    "magazzino",
  );
  const auth = getAuth();
  const [storage, setStorage] = useState<Listitem[]>([]);
  const { getStorage, dbReady, lastUpdate } = useFirebaseApp();
  const [_, setLogin] = useLocalStorage({
    key: "login",
    defaultValue: "",
  });

  useEffect(() => {
    if (dbReady)
      getStorage(tabSelected).then((doc) => {
        setStorage(doc);
      });
  }, [dbReady, lastUpdate, tabSelected]);

  return (
    <Box p={"10px 8px"} h={"100vh"} w={"100vw"}>
      <Flex justify={"space-between"}>
        <Image src={logo} w={100} />
        <ActionIcon
          onClick={() => signOut(auth).then(() => setLogin(""))}
          variant={"transparent"}
          color={"white"}
        >
          <IconDoorExit />
        </ActionIcon>
      </Flex>
      <Title ml={10} mt={16} c={"white"}>
        Gestionale
      </Title>
      <Title ml={10} order={5}>
        Inserisci sotto tutte le provviste nel magazzino o aggiungi alla lista
        della spesa ciò che scarseggia
      </Title>
      <Space h={30} />
      <Stack gap={0}>
        <Group gap={0}>
          <Box
            c={"white"}
            fz={14}
            fw={tabSelected === "magazzino" ? 700 : 500}
            bg={"red.5"}
            p={"6px 4px"}
            style={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
            onClick={() => setTabSelected("magazzino")}
          >
            Magazzino
          </Box>
          <Box
            c={"white"}
            fz={14}
            fw={tabSelected === "carrello" ? 700 : 500}
            bg={"blue.5"}
            p={"6px 4px"}
            style={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
            onClick={() => setTabSelected("carrello")}
          >
            Lista della spesa
          </Box>
        </Group>
        <Paper
          style={{
            borderBottomRightRadius: 4,
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
          }}
          radius={0}
          fz={18}
          c={"gray.9"}
          p={"10px 6px"}
          bg={tabSelected === "magazzino" ? "red.5" : "blue.5"}
        >
          <List list={storage} path={tabSelected} />
        </Paper>
      </Stack>
    </Box>
  );
}

export default App;
