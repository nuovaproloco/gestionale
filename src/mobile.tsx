import {Listitem, Tabs} from "./common/type/types";
import {
    ActionIcon,
    Box,
    Button,
    Flex,
    Image,
    LoadingOverlay,
    Paper,
    Text,
    Title,
    useMantineColorScheme
} from "@mantine/core";
import pattern from "./assets/pattern.svg";
import {getAuth, signOut} from "firebase/auth";
import {IconDoorExit} from "@tabler/icons-react";
import flipStart from "./assets/flip_start.svg";
import flipEnd from "./assets/flip_end.svg";
import Selector from "./components/selector/selector.tsx";
import {useEffect, useState} from "react";
import {useDebouncedCallback, useLocalStorage} from "@mantine/hooks";
import {useFirebaseApp} from "./common/provider/firebaseProvider.tsx";

export function Mobile() {
    const [tabSelected, setTabSelected] = useState<Tabs>("magazzino");
    const auth = getAuth();
    const [storage, setStorage] = useState<Listitem[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const setLoadingCallback = useDebouncedCallback(
        (x: boolean) => setIsFetching(x),
        500,
    );
    const { getStorage, dbReady, lastUpdate } = useFirebaseApp();
    const [, setLogin] = useLocalStorage({
        key: "login",
        defaultValue: "",
    });
    const { colorScheme } = useMantineColorScheme();

    useEffect(() => {
        if (dbReady) {
            setLoadingCallback(true);
            getStorage(tabSelected)
                .then((doc) => {
                    setStorage(doc);
                })
                .finally(() => setLoadingCallback(false));
        }
    }, [dbReady, lastUpdate, tabSelected]);

    return (
        <Flex
            p={10}
            style={{
                overflow: "hidden",
                background: `url(${pattern})`,
                backgroundSize: "contain",
            }}
            direction={"column"}
            h={"100dvh"}
            w={"100dvw"}
        >
            <Flex justify={"end"}>
                <ActionIcon
                    onClick={() => signOut(auth).then(() => setLogin(""))}
                    variant={"transparent"}
                    color={colorScheme === "light" ? "black" : "white"}
                >
                    <IconDoorExit/>
                </ActionIcon>
            </Flex>
            <Flex m={"0 auto"} maw={550} pos={"relative"} mt={8}>
                <Image src={flipStart}/>
                <Box flex={1} pr={2} mx={-2} bg={"#1D92E1"} h={96}>
                    <Title ta={"center"} c={"white"}>
                        Gestionale
                    </Title>
                    <Text ta={"center"} pos={"absolute"} left={34} right={34} c={"white"}>
                        Una sola piattaforma per gestire l'associazione
                    </Text>
                </Box>
                <Image src={flipEnd}/>
            </Flex>
            <Flex my={12} justify={"space-evenly"} gap={0}>
                <Button
                    variant={tabSelected === "magazzino" ? "filled" : "outline"}
                    radius={10}
                    miw={100}
                    fz={14}
                    fw={tabSelected === "magazzino" ? 700 : 500}
                    color={"#F9B838"}
                    p={"6px 4px"}
                    onClick={() => setTabSelected("magazzino")}
                >
                    Magazzino
                </Button>
                <Button
                    variant={tabSelected === "carrello" ? "filled" : "outline"}
                    radius={10}
                    fz={14}
                    miw={100}
                    fw={tabSelected === "carrello" ? 700 : 500}
                    color={"#F9B838"}
                    p={"6px 4px"}
                    onClick={() => setTabSelected("carrello")}
                >
                    Lista della spesa
                </Button>
                <Button
                    variant={tabSelected === "incassi" ? "filled" : "outline"}
                    radius={10}
                    fz={14}
                    miw={100}
                    fw={tabSelected === "incassi" ? 700 : 500}
                    color={"#F9B838"}
                    p={"6px 4px"}
                    onClick={() => setTabSelected("incassi")}
                >
                    Incassi
                </Button>
            </Flex>
            <Paper
                flex={1}
                display={"flex"}
                style={{flexDirection: "column", overflowX: "hidden"}}
                bg={"#0B2A55"}
                radius={18}
                fz={18}
                c={"gray.9"}
                p={12}
                pos={"relative"}
            >
                <LoadingOverlay
                    transitionProps={{transition: "fade"}}
                    visible={isFetching}
                />
                <Selector list={storage} tab={tabSelected}/>
            </Paper>
        </Flex>
    );
}