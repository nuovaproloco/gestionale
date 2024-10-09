import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FirebaseDbProvider from "./common/provider/firebaseProvider.tsx";
import Login from "./login.tsx";

const theme = createTheme({
  fontFamily: "Outfit, sans-serif",
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseDbProvider>
        <MantineProvider theme={theme} defaultColorScheme={"dark"}>
          <Routes>
            <Route path={"/"} element={<App />}></Route>
            <Route path={"/login"} element={<Login />}></Route>
          </Routes>
        </MantineProvider>
      </FirebaseDbProvider>
    </BrowserRouter>
  </StrictMode>,
);
