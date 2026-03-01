import {
  Box,
  Center,
  Divider,
  FileInput,
  Flex,
  Image,
  Modal,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import carousel1 from "./assets/cinema_onboarding_1.png";
import carousel2 from "./assets/cinema_onboarding_2.png";
import carousel3 from "./assets/cinema_onboarding_3.png";
import { generaReportHTML } from "./common/util/exportCashflow.ts";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import { IconRefresh } from "@tabler/icons-react";

const Cinema = () => {
  const [message, setMessage] = useState<string>();
  const [modalOpen, modalHandler] = useDisclosure();
  return (
    <Box>
      <Modal size={"xl"} opened={modalOpen} onClose={modalHandler.close}>
        <Title ta={"center"}>Quale file devo caricare?</Title>
        <Divider my={16}></Divider>
        <Box w={"80%"} m={"0 auto"}>
          <Carousel withIndicators height={500}>
            <Carousel.Slide>
              <Text mb={8} fz={18} ta={"center"}>
                Seleziona Reportistica {">"} Incasso online e globale
              </Text>
              <Image fit={"contain"} src={carousel1} />
            </Carousel.Slide>
            <Carousel.Slide>
              <Text mb={8} fz={18} ta={"center"}>
                Inserisci la data di oggi e seleziona "Data spettacolo"
              </Text>
              <Image fit={"contain"} src={carousel2} />
            </Carousel.Slide>
            <Carousel.Slide>
              <Text mb={8} fz={18} ta={"center"}>
                Clicca sul simbolo <IconRefresh size={16} />, seleziona il
                titolo del film e premi "Mostra"
              </Text>
              <Image fit={"contain"} src={carousel3} />
            </Carousel.Slide>
            <Carousel.Slide>
              <Center h={"100%"}>
                <Text w={"90%"} mb={8} fz={18} ta={"center"}>
                  Fatto!
                  <br />
                  Ora ti resta solo qui caricare il file che troverai nella
                  cartella Download
                </Text>
              </Center>
            </Carousel.Slide>
          </Carousel>
        </Box>
      </Modal>
      <Flex
        justify={"center"}
        align={"center"}
        h={200}
        style={{
          backgroundColor: "#ffffff",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%238c4c4c' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        }}
      >
        <Text ta={"center"} fw={700} fz={"clamp(2rem, 3vw, 10rem)"}>
          CINEMA SOCIALE
        </Text>
      </Flex>
      <Divider mb={23} size={4} color={"#ba0000"} />
      <Flex gap={"1%"} justify={"space-evenly"} mx={18}>
        <Paper w={"30%"} withBorder p={10} fz={18}>
          <Text fw={600} fz={"1em"}>
            Carica il file esportato dalla biglietteria:
          </Text>
          <FileInput
            w={300}
            placeholder={"Clicca qui per caricare"}
            onChange={(event) => {
              if (event)
                generaReportHTML(event).then((returnMessage) => {
                  setMessage(returnMessage);
                });
            }}
          />
          <Text
            style={{ cursor: "pointer" }}
            onClick={modalHandler.open}
            fz={12}
            td={"underline"}
            c={"blue"}
          >
            Non sai quale file caricare? clicca qui
          </Text>
        </Paper>
        <Paper
          p={10}
          withBorder
          flex={1}
          dangerouslySetInnerHTML={{
            __html:
              message ?? "<H2>Qui apparirà il riepilogo degli incassi...</H2>",
          }}
        ></Paper>
      </Flex>
    </Box>
  );
};

export default Cinema;
