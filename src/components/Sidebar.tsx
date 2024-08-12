import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControl,
  FormHelperText,
  OutlinedInput,
} from "@mui/material";
import { DateTimePicker } from "react-datetime-picker";
import { validationSchema } from "../utils/yup";
import { createStyles } from "@mui/styles";
import axios from "axios";

interface BannerFormData {
  bannerImage: FileList;
  bannerDescription: string;
  bannerLink: string;
  timer: Date | null;
  showBanner: boolean;
}

interface Props {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = (props: Props) => {
  const { showSidebar, setShowSidebar } = props;
  const styles = useStyle(showSidebar);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<BannerFormData>({
    //@ts-ignore
    resolver: yupResolver(validationSchema),
    defaultValues: {
      timer: new Date(),
      showBanner: false,
    },
  });

  const onSubmit = async (data: BannerFormData) => {
    try {
      const formData = new FormData();
      //@ts-ignore
      formData.append("image", data.bannerImage);
      formData.append("description", data.bannerDescription);
      formData.append("link", data.bannerLink);
      formData.append("duration", data.timer?.toISOString() || "");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      // Make the API call
      const response = await axios.post(
        "https://f1c8-2401-4900-5990-7076-80a7-ca26-430e-19c4.ngrok-free.app/api/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          "https://f1c8-2401-4900-5990-7076-80a7-ca26-430e-19c4.ngrok-free.app/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const { url } = response.data;
        setBannerPreview(url);
        setValue("bannerImage", url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar]);

  return (
    <Box sx={styles.wrapper} ref={ref}>
      <Box mb={3}>
        <Typography>Show Banner</Typography>
        <Controller
          name="showBanner"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onChange={field.onChange} />
          )}
        />
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal">
          <OutlinedInput
            id="bannerImage"
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleImageChange}
            error={!!errors.bannerImage}
          />
          {errors.bannerImage && (
            <FormHelperText error>{errors.bannerImage.message}</FormHelperText>
          )}
          {bannerPreview && (
            <Box mt={2}>
              <img
                src={bannerPreview}
                alt="Banner Preview"
                style={{ width: "100%", maxHeight: "200px" }}
              />
            </Box>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Controller
            name="bannerDescription"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Banner Description"
                multiline
                rows={4}
                error={!!errors.bannerDescription}
                helperText={errors.bannerDescription?.message}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Controller
            name="bannerLink"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Banner Link"
                error={!!errors.bannerLink}
                helperText={errors.bannerLink?.message}
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Controller
            name="timer"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                onChange={field.onChange}
                value={field.value || null}
                //@ts-ignore
                // renderInput={(params) => (
                //   <TextField
                //     {...params}
                //     error={!!errors.timer}
                //     helperText={errors.timer?.message}
                //   />
                // )}
              />
            )}
          />
        </FormControl>

        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Sidebar;

const useStyle = (showSidebar: boolean) =>
  createStyles({
    wrapper: {
      width: "40vw",
      position: "absolute",
      left: showSidebar ? "0" : "-100%",
      top: "2.5%",
      backgroundColor: "lightgreen",
      transition: "left 0.4s ease-in",
      zIndex: 5,
      height: "97%",
    },
  });
