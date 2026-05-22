import { useState } from "react";
import AppRoutes from "./routes";
import SplashScreen from "./components/layout/SplashScreen";
import "./index.css";

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("hasSeenSplash");
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <AppRoutes />;
}

export default App;
