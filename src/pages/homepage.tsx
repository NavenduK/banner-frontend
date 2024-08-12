import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Banner from "../components/Banner";

const Home = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleShowSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <Box>
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <Banner handleShowSidebar={handleShowSidebar} />
    </Box>
  );
};

export default Home;
