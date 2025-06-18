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
  radius: {
    xs: "4px",
    sm: "8px",
    md: "8px",
    lg: "8px",
    xl: "8px",
  },
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={"/gestionale"}>
      <FirebaseDbProvider>
        <MantineProvider theme={theme}>
          <Routes>
            <Route path={"/login"} element={<Login />}></Route>
            <Route path={""} element={<App />}></Route>
          </Routes>
        </MantineProvider>
      </FirebaseDbProvider>
    </BrowserRouter>
  </StrictMode>,
);
