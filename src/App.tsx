import "./App.css";
import { Mobile } from "./mobile.tsx";
import { useMediaQuery } from "@mantine/hooks";
import { Desktop } from "./desktop.tsx";

function App() {
  const isMobile = useMediaQuery("(orientation: portrait)");
  if (isMobile) return <Mobile />;
  return <Desktop />;
}

export default App;
