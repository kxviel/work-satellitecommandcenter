import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Typography,
  Radio,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { commonContainerWrapper } from "../../Common/styles/flex";
import { ModalActionButtonStyles } from "../../Common/styles/modal";
import PickColorModal from "./Modals/PickColorModal";
import { ColorBox } from "../../Common/UI/ColourPicker";
import { useAppDispatch } from "../../../Redux/hooks";
import { setStateToggle } from "../../../Redux/reducers/userSlice";
import CustomTextModal from "./Modals/CustomTextModal";
import { Add, Edit, Save } from "@mui/icons-material";

type Props = {
  canEdit: boolean;
};

const ThemeGeneral = ({ canEdit }: Props) => {
  const dispatch = useAppDispatch();
  const { id: studyId } = useParams();
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [showColourModal, setShowColourModal] = useState<{
    show: boolean;
    id: any;
  }>({ show: false, id: "" });
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [selected, setSelected] = useState<any>("");
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [openTextModal, setOpenTextModal] = useState<{
    show: boolean;
    id: any;
  }>({ show: false, id: "" });
  // const [idList, setIdList] = useState<any[]>([]);
  const [customThemeLoader, setCustomThemeLoader] = useState<string>("");
  const [text, setText] = useState<any>("");
  const [data, setData] = useState<any[]>([]);
  const [toggleLoader, setToggleLoader] = useState<boolean>(false);

  const closeModal = () => {
    setOpenTextModal({ show: false, id: "" });
    setShowColourModal({ show: false, id: "" });
    setSelected("");
    setText("");
    setSelectedPath("");
  };

  const handleEditClick = (
    path: string,
    color?: string,
    text?: string,
    id?: string
  ) => {
    if (path === "name" || path === "description") {
      setOpenTextModal({ show: true, id: id });
    } else {
      setSelected(color);
      setSelectedPath(path);
      setShowColourModal({ show: true, id: id });
    }
  };

  const refreshPage = () => {
    setToggleLoader((prev: boolean) => !prev);
  };

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        setLoading(true);
        let url = `/ui/theme-settings?studyId=${studyId}`;
        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;
        setData(data || []);
        let selected = data?.find((theme: any) => theme?.isSelected === true);
        if (data?.length > 0 && !selected) {
          selected = data[0];
        }
        setSelectedTheme(selected);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchGeneralData();
  }, [setLoading, studyId, toggleLoader]);

  const submitHandler = async () => {
    try {
      if (
        !selectedTheme?.colorConfig?.primaryColor ||
        !selectedTheme?.colorConfig?.secondaryTextColor ||
        !selectedTheme?.colorConfig?.secondaryColor ||
        !selectedTheme?.colorConfig?.textColor ||
        !selectedTheme?.colorConfig?.backgroundColor
      ) {
        toastMessage("error", "All colors must be entered!");
        return;
      }
      if (selectedTheme?.id?.startsWith("custom")) {
        toastMessage("error", "Custom theme must be saved!");
        return;
      }
      setButtonLoader(true);
      let res: AxiosResponse;
      res = await http.post(
        `/ui/theme-settings/${selectedTheme?.id}/activate?studyId=${studyId}`
      );
      toastMessage("success", res.data.message);
      dispatch(setStateToggle());
      setButtonLoader(false);
    } catch (err) {
      setButtonLoader(false);
      errorToastMessage(err as Error);
    }
  };

  const handleActionClick = (theme: any) => {
    setSelectedTheme(theme);
  };
  const handleAddTheme = () => {
    const newTheme = {
      id: `custom-theme-${data?.length + 1}`,
      name: `Custom Theme ${data?.length + 1}`,
      description: "Custom Editable Theme",
      colorConfig: {
        primaryColor: "",
        secondaryColor: "",
        textColor: "",
        secondaryTextColor: "",
        backgroundColor: "",
      },
    };
    setData([...data, newTheme]);
  };
  // const handleRemoveTheme = (id: string) => {
  //   setData((prev: any[]) => prev.filter((theme) => theme?.id !== id));
  //   let selected = data?.find((theme: any) => theme?.isSelected === true);
  //   if (data?.length > 0 && !selected) {
  //     selected = data[0];
  //   }
  //   setSelectedTheme(selected);
  // };
  const saveCustomTheme = async (theme: any) => {
    try {
      setCustomThemeLoader(theme?.id);
      let res: AxiosResponse;
      const body = {
        name: theme?.name,
        description: theme?.description,
        colorConfig: theme?.colorConfig,
        studyId: studyId,
      };
      if (
        !body.colorConfig.primaryColor ||
        !body.colorConfig.secondaryTextColor ||
        !body.colorConfig.secondaryColor ||
        !body.colorConfig.textColor ||
        !body.colorConfig.backgroundColor
      ) {
        toastMessage("error", "All colors must be entered!");
        return;
      }
      if (theme?.id.startsWith("custom")) {
        res = await http.post(`/ui/theme-settings`, body);
        refreshPage();
      } else {
        res = await http.put(`/ui/theme-settings/${theme?.id}`, body);
        if (!theme?.id.startsWith("custom") && theme?.isSelected === true) {
          dispatch(setStateToggle());
        } else {
          refreshPage();
        }
      }
      toastMessage("success", res.data.message);
    } catch (err) {
      errorToastMessage(err as Error);
    } finally {
      setCustomThemeLoader("");
    }
  };

  return (
    <>
      {loading ? (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box sx={{ ...commonContainerWrapper }}>
          <Typography variant="h6" fontWeight={600}>
            Theme
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(368px, 1fr))",
              gridGap: "16px",
              mt: 3,
              cursor: "pointer",
            }}
          >
            {data?.map((theme: any) => (
              <Box
                key={theme.id}
                sx={{
                  border: 2,
                  borderColor: "divider",
                  p: 2,
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={canEdit ? () => handleActionClick(theme) : undefined}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="h6" fontWeight={600}>
                        {theme.name}
                      </Typography>
                      {canEdit && !(theme.source === "system") && (
                        <IconButton
                          onClick={
                            canEdit
                              ? () =>
                                  handleEditClick(
                                    "name",
                                    "",
                                    theme?.name,
                                    theme?.id
                                  )
                              : undefined
                          }
                        >
                          <Edit sx={{ color: "text.secondary" }} />
                        </IconButton>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        color={"text.secondary"}
                        mt={1}
                      >
                        {theme.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ marginTop: theme?.description ? 0 : 2 }}>
                    <Radio
                      checked={selectedTheme?.id === theme?.id}
                      readOnly={!canEdit}
                      sx={{ color: "text.secondary" }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                    {[
                      "primaryColor",
                      "secondaryColor",
                      "textColor",
                      "secondaryTextColor",
                      "backgroundColor",
                    ].map((color: string) => (
                      <ColorBox
                        key={color}
                        sx={{
                          backgroundColor: theme.colorConfig[color]
                            ? theme.colorConfig[color]
                            : "transparent",
                          border: 2,
                          borderColor: "divider",
                        }}
                        onClick={
                          canEdit && !(theme.source === "system")
                            ? () =>
                                handleEditClick(
                                  color,
                                  theme.colorConfig[color],
                                  "",
                                  theme.id
                                )
                            : undefined
                        }
                      >
                        {!theme.colorConfig[color] && (
                          <IconButton>
                            <Add sx={{ color: "text.secondary" }} />
                          </IconButton>
                        )}
                      </ColorBox>
                    ))}
                  </Box>
                  {!(theme.source === "system") && (
                    <Box>
                      {!(theme?.id === customThemeLoader) ? (
                        <>
                          {canEdit && (
                            <IconButton onClick={() => saveCustomTheme(theme)}>
                              <Save sx={{ color: "text.secondary" }} />
                            </IconButton>
                          )}
                        </>
                      ) : (
                        <Box>
                          <CircularProgress />
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
            <Box
              sx={{
                border: 2,
                borderColor: "divider",
                p: 2,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={canEdit ? handleAddTheme : undefined}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Add fontSize="medium" sx={{ color: "primary.main" }} />
                <Typography
                  color="primary.main"
                  variant="subtitle1"
                  fontWeight={600}
                >
                  Add Custom Theme
                </Typography>
              </Box>
            </Box>
          </Box>
          {showColourModal?.show && (
            <PickColorModal
              showModal={showColourModal?.show}
              closeModal={closeModal}
              path={selectedPath}
              palette={selected}
              setTheme={setData}
              id={showColourModal?.id}
              setSelectedTheme={setSelectedTheme}
            />
          )}
          {openTextModal?.show && (
            <CustomTextModal
              showModal={openTextModal?.show}
              path={selectedPath}
              closeModal={closeModal}
              text={text}
              setTheme={setData}
              selectedTheme={selectedTheme}
              id={selectedTheme}
            />
          )}
          {canEdit && (
            <Box sx={{ ...ModalActionButtonStyles, mt: 4 }}>
              {!buttonLoader ? (
                <>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={submitHandler}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <CircularProgress size={25} />
              )}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default ThemeGeneral;
