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

  return (
    <>
      <AppRoutes />
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
    </>
  );
}

export default App;
