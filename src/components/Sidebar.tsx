import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { validationSchema } from "../utils/yup";
import { createStyles } from "@mui/styles";

interface BannerFormData {
  bannerImage: FileList;
  bannerDescription: string;
  bannerLink: string;
  timer: any;
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
  } = useForm<BannerFormData>({
    //@ts-ignore
    resolver: yupResolver(validationSchema),
    defaultValues: {
      timer: dayjs(),
      showBanner: false,
    },
  });

  const onSubmit = (data: BannerFormData) => {
    console.log("Form Data:", data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("bannerImage", e.target.files as FileList);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

        {/* <FormControl fullWidth margin="normal">
                    <Controller
                        name="timer"
                        control={control}
                        render={({ field }) => (
                            <DateTimePicker
                                label="Timer"
                                value={field.value}
                                onChange={(newValue) => field.onChange(newValue)}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        error={!!errors.timer}
                                        helperText={errors.timer?.message}
                                    />
                                )}
                            />
                        )}
                    />
                </FormControl> */}

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
