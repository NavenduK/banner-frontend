import { Box, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import duration from "dayjs/plugin/duration";

interface Props {
  handleShowSidebar: () => void;
}

const Banner = (props: Props) => {
  const { handleShowSidebar } = props;
  const [timeLeft, setTimeLeft] = useState<number>(0);
  useEffect(() => {
    const targetTime = dayjs().add(4, "hour").valueOf();

    const updateTimer = () => {
      const now = dayjs().valueOf();
      const distance = targetTime - now;

      if (distance < 0) {
        setTimeLeft(0);
        return;
      }

      setTimeLeft(distance);
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const styles = useStyle();
  return (
    <Box>
      <Box>
        <GiHamburgerMenu onClick={handleShowSidebar} />
      </Box>
      <Box sx={styles.bannerWrapper}>
        <Box
          component="img"
          src="https://png.pngtree.com/background/20210706/original/pngtree-dynamic-red-background-picture-image_149101.jpg"
          alt="banner"
          sx={styles.banner}
        />
        <Box sx={styles.desc}>
          <Box sx={styles.timer}> {formatTime(timeLeft)}</Box>
          <Typography sx={styles.decs}>Banner Description</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Banner;

const useStyle = () =>
  createStyles({
    bannerWrapper: {
      position: "relative",
    },
    banner: {
      maxWidth: "100%",
    },
    desc: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    timer: {
      color: "white",
      fontSize: "42px",
      fontWeight: "bold",
    },
    decs: {
      fontSize: "18px",
      color: "grey",
    },
  });
