import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { GiHamburgerMenu } from "react-icons/gi";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface Props {
  handleShowSidebar: () => void;
}

const Banner = (props: Props) => {
  const { handleShowSidebar } = props;
  const [bannerImage, setBannerImage] = useState<string>("");
  const [bannerDescription, setBannerDescription] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://d435-2401-4900-5990-7076-80a7-ca26-430e-19c4.ngrok-free.app/api"
        );
        const { image, duration } = response.data;
        setBannerImage(image);
        setBannerDescription(duration);
        setTimer(new Date(timer).getTime());
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (timer) {
      const updateTimer = () => {
        const now = dayjs().valueOf();
        const distance = timer - now;

        if (distance < 0) {
          setTimeLeft(0);
          return;
        }

        setTimeLeft(distance);
      };

      updateTimer();
      const timerInterval = setInterval(updateTimer, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [timer]);

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
          src={bannerImage || "default-image-url.jpg"} // Fallback image URL if bannerImage is not available
          alt="banner"
          sx={styles.banner}
        />
        <Box sx={styles.desc}>
          <Box sx={styles.timer}> {formatTime(timeLeft)}</Box>
          <Typography sx={styles.descText}>{bannerDescription}</Typography>
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
      textAlign: "center",
    },
    timer: {
      color: "white",
      fontSize: "42px",
      fontWeight: "bold",
    },
    descText: {
      fontSize: "18px",
      color: "grey",
    },
  });
