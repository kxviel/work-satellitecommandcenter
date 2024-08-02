import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Modal, TextField } from "@mui/material";
import { HexAlphaColorPicker } from "react-colorful";
import {
  ModalBaseStyles,
  ModalActionButtonStyles,
} from "../../../Common/styles/modal";

const PickColorModal = ({
  showModal,
  closeModal,
  palette,
  path,
  id,
  setTheme,
  setSelectedTheme,
}: any) => {
  const initialHex = palette?.substring(0, 7);
  const initialAlphaHex = palette?.substring(7);
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);
  const [color, setColor] = useState<any>(null);
  useEffect(() => {
    setColor({
      hex: initialHex || "#FFFFFF",
      opacityPercentage: initialAlphaHex
        ? (parseInt(initialAlphaHex, 16) / 255) * 100
        : 100,
    });
  }, [palette, initialHex, initialAlphaHex]);

  const handleChange = (color: string) => {
    const { hex, opacityPercentage } = getHexAndOpacityFromAlphaHex(color);
    setColor({ hex, opacityPercentage });
  };

  const getHexAndOpacityFromAlphaHex = (alphahex: string) => {
    const hex = alphahex.substring(0, 7);
    const alphaHex = alphahex.substring(7) || "ff";
    const alpha = parseInt(alphaHex, 16) / 255;
    const opacityPercentage = Math.round(alpha * 100);

    return {
      hex: hex,
      opacityPercentage: opacityPercentage,
    };
  };

  const handleHexInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = event.target.value;
    setColor({ ...color, hex: newHex });
    updateColorFromHex(newHex, color.opacityPercentage);
  };

  const handleOpacityInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOpacity = parseInt(event.target.value, 10);
    if (!isNaN(newOpacity) && newOpacity >= 0 && newOpacity <= 100) {
      setColor({ ...color, opacityPercentage: newOpacity });
      updateColorFromHex(color.hex, newOpacity);
    }
  };

  const updateColorFromHex = (newHex: string, newOpacity: number) => {
    const alpha = newOpacity / 100;
    const alphaHex = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    const newColor = `${newHex}${alphaHex}`;
    handleChange(newColor);
  };

  const submitHandler = () => {
    setSubmitLoader(true);

    const opacity = color.opacityPercentage ?? 100;
    const alphaHex = Math.round((opacity / 100) * 255)
      .toString(16)
      .padStart(2, "0");
    const alphaHexColor = `${color.hex}${alphaHex}`;
    setSelectedTheme((prev: any) => ({
      ...prev,
      colorConfig: {
        ...prev.colorConfig,
        [path]: alphaHexColor,
      },
    }));
    setTheme((prev: any[]) => {
      const updatedData = prev.map((theme) => {
        if (theme.id === id) {
          return {
            ...theme,
            colorConfig: {
              ...theme.colorConfig,
              [path]: alphaHexColor,
            },
          };
        }
        return theme;
      });
      return updatedData;
    });

    setSubmitLoader(false);
    closeModal();
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box
        sx={{
          ...ModalBaseStyles,
          minHeight: "50vh",
          width: {
            xs: "96vw",
            md: "25vw",
          },
        }}
      >
        <Box
          sx={{
            "& .react-colorful__hue": {
              height: "12px",
              mt: 3,
              mb: 3,
              borderRadius: 1,
            },
            "& .react-colorful__alpha, .react-colorful__alpha": {
              height: "12px",
              mb: 3,
              borderRadius: 1,
            },
            "& .react-colorful__saturation": {
              borderRadius: 0.5,
              height: "152px",
            },
            "& .react-colorful__pointer": {
              height: "12px",
              width: "12px",
              borderWidth: 3,
            },
          }}
        >
          <HexAlphaColorPicker
            color={
              `${color?.hex}${Math.round((color?.opacityPercentage / 100) * 255)
                .toString(16)
                .padStart(2, "0")}` || ""
            }
            onChange={(color) => handleChange(color)}
            style={{ width: "100%", height: "80%" }}
          />
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              value={color?.hex || ""}
              inputProps={{ readOnly: true }}
              onChange={handleHexInputChange}
              style={{ width: "50%", marginTop: "2%" }}
            />
            <TextField
              inputProps={{ readOnly: true }}
              value={(color?.opacityPercentage || 0).toFixed(0)}
              onChange={handleOpacityInputChange}
              style={{ width: "50%", marginTop: "2%" }}
            />
          </Box>
          <Box sx={{ ...ModalActionButtonStyles, mt: 3 }}>
            {!submitLoader ? (
              <>
                <Button onClick={closeModal} variant="outlined">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={submitHandler}
                >
                  Save
                </Button>
              </>
            ) : (
              <CircularProgress size={25} />
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PickColorModal;
