import { Box, Button, Flex, Image, Stack, Text, Title } from "@mantine/core";
import logo from "./assets/logo_compatto_bianco.svg";
import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFirebaseApp } from "./common/provider/firebaseProvider.tsx";

const Login = () => {
  const { signinWithGoogle } = useFirebaseApp();
  const [login, setLogin] = useLocalStorage({
    key: "login",
    defaultValue: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (login) navigate("");
  }, [login]);

  return (
    <>
      <Stack align={"center"} w={"90%"} m={"0 auto"} h={"100vh"}>
        <Image mt={"30%"} w={210} src={logo} />
        <Box>
          <Title ta={"center"} order={2}>
            Accedi con Google
          </Title>
          <Flex mt={16} justify={"center"}>
            <Button
              w={218}
              color={error ? "red" : "blue"}
              onClick={() => {
                setError(false);
                signinWithGoogle()
                  .then((e) => {
                    if (e.user.uid !== "DKnCJH87brPpcZ1eakCLEtg5qOC2")
                      return setError(true);
                    setLogin(e.user.uid);
                    navigate("/");
                  })
                  .catch(() => {
                    setError(true);
                  });
              }}
            >
              Accedi
            </Button>
          </Flex>
          {error && (
            <Text mt={16} c={"red"}>
              Credenziali errate o account non autorizzato
            </Text>
          )}
        </Box>
      </Stack>
      <Box w={"100%"} ta={"center"} pos={"absolute"} bottom={6} fz={8}>
        Tutti i diritti sono riservati. Questa piattaforma è di proprieta di
        Nuova Proloco Città di Luino
      </Box>
    </>
  );
};

export default Login;
