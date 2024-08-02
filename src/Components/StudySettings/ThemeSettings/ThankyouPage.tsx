import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { themeUploadUrl } from "../../../utils/upload";
import { useDropzone } from "react-dropzone";
import { Add, Delete } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Formik } from "formik";
import { LabelStyle, HalfInputWrapper } from "../../Common/styles/form";
import * as yup from "yup";
import { ModalActionButtonStyles } from "../../Common/styles/modal";
import { commonContainerWrapper } from "../../Common/styles/flex";
import http from "../../../utils/http";
import ThankyouPreviewPanel from "./Modals/ThankyouPreviewPanel";

const uploadWrapper: SxProps = {
  width: 130,
  height: 90,
  borderRadius: "8px",
  border: 2,
  borderColor: "primary.main",
  borderStyle: "dashed",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: 2,
  px: 4,
  "&:hover": {
    bgcolor: "secondary.dark",
    cursor: "pointer",
  },
};
type Props = {
  canEdit: boolean;
};

const layoutList = [
  { value: "layout_1", label: "Layout 1" },
  { value: "layout_2", label: "Layout 2" },
];

const UploadImageItem: React.FC<any> = ({
  image,
  setFieldValue,
  readOnly,
  name,
  fieldName,
  studyId,
}) => {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      try {
        const file = acceptedFiles?.[0];
        if (file) {
          if (file.size > 10 * 1024 * 1024) {
            toastMessage("warning", "File Size cannot be greater than 10 MB!");
            return;
          }
          setLoading(true);
          const url = await themeUploadUrl(file, studyId);
          if (url) {
            const obj = {
              previewUrl: url?.previewUrl,
              url: url?.postUploadImageUrl,
            };
            setFieldValue(fieldName, obj);
          }
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    },
    [setFieldValue, fieldName, studyId]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: !readOnly ? onDrop : undefined,
    multiple: false,
    accept: {
      "image/jpg": [],
      "image/jpeg": [],
      "image/png": [],
    },
    noClick: readOnly,
  });

  return (
    <>
      {loading && (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Box
        {...getRootProps({ className: "dropzone" })}
        sx={{
          ...uploadWrapper,
        }}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& .preview-img": {
              width: "130px",
              height: "90px",
              borderRadius: "8px",
            },
          }}
        >
          {image ? (
            <img src={image} className="preview-img" alt={name} />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Add fontSize="medium" sx={{ color: "text.secondary" }} />
              <Typography
                sx={{ color: "text.secondary" }}
                fontSize={12}
                fontWeight={600}
                textAlign={"center"}
              >
                Upload image
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Typography variant="body1" color={"text.secondary"} mt={2} width={"75%"}>
        Image size - 258x70px, 10MB Max
      </Typography>
    </>
  );
};

const formatThankyouData = (data: any) => {
  const formattedData: any = {
    title: data?.content?.title,
    subtext: data?.content?.subtext,
    footer: data?.content?.footer,
    layout: data?.layoutKey,
    headerLogo: data?.logos?.find((img: any) => img.key === "header"),

    footerLogo: data?.logos?.find((img: any) => img.key === "footer"),
  };
  return formattedData;
};
let schema = yup.object().shape({
  title: yup.string().trim().required("Title is required"),
  subtext: yup.string().trim().required("Subtext is required"),
  layout: yup.string().trim().required("Layout is required"),
  footer: yup.string().trim().optional(),
  headerLogo: yup.object().shape({
    url: yup.string().optional().nullable(),
    previewUrl: yup.string().optional().nullable(),
    key: yup.string().optional().nullable(),
  }),
  footerLogo: yup.object().shape({
    url: yup.string().optional().nullable(),
    previewUrl: yup.string().optional().nullable(),
    key: yup.string().optional().nullable(),
  }),
});

const ThankyouPage = ({ canEdit }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);
  const [toggleLoader, setToggleLoader] = useState(false);
  const { id: studyId } = useParams();
  const [showPreview, setShowPreview] = useState(false);
  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };
  useEffect(() => {
    const fetchThemeData = async () => {
      try {
        setLoading(true);
        let url = `/ui/pages?studyId=${studyId}&pageKey=thank_you`;
        const res: AxiosResponse = await http.get(url);
        const data = res?.data?.data;
        const newData = formatThankyouData(data);
        setData(newData || {});
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchThemeData();
  }, [studyId, toggleLoader]);

  const showPreviewModal = () => {
    setShowPreview(true);
  };
  const closePreview = () => {
    setShowPreview(false);
  };

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body: any = {
        studyId: studyId,
        layoutKey: values?.layout,
        pageKey: "thank_you",
        logos: [
          values?.headerLogo?.url && {
            url:
              values?.headerLogo?.postUploadImageUrl ?? values?.headerLogo?.url,
            key: "header",
          },
          values?.footerLogo?.url && {
            url:
              values?.footerLogo?.postUploadImageUrl ?? values?.footerLogo?.url,
            key: "footer",
          },
        ].filter(Boolean),
        content: {
          title: values?.title,
          subtext: values?.subtext,
          footer: values?.footer,
        },
      };
      let res: AxiosResponse;
      res = await http.post(`/ui/pages`, body);

      toastMessage("success", res.data.message);
      setSubmitLoader(false);
      refreshPage();
    } catch (err) {
      setSubmitLoader(false);
      errorToastMessage(err as Error);
    }
  };

  return (
    <Box sx={{ ...commonContainerWrapper }}>
      {loading ? (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box>
          <Formik
            initialValues={{
              title: data?.title || "",
              subtext: data?.subtext || "",
              footer: data?.footer || "",
              layout: data?.layout || "layout_1",
              headerLogo: data?.headerLogo || {
                url: "",
                key: "header",
                previewUrl: "",
              },
              footerLogo: data?.footerLogo || {
                url: "",
                key: "footer",
                previewUrl: "",
              },
            }}
            validationSchema={canEdit ? schema : undefined}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({
              getFieldProps,
              errors,
              touched,
              setFieldValue,
              values,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6">Theme</Typography>
                  <Button variant="contained" onClick={showPreviewModal}>
                    Preview
                  </Button>
                </Box>
                <Box>
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <FormLabel sx={LabelStyle} htmlFor="theme-layout">
                      Theme Layout <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <Select
                      value={values?.layout}
                      onChange={(e) => {
                        setFieldValue("layout", e.target.value);
                      }}
                      readOnly={!canEdit}
                    >
                      {layoutList.map((item) => (
                        <MenuItem key={item?.value} value={item?.value}>
                          {item?.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {touched?.layout && errors?.layout
                        ? (errors?.layout as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                </Box>
                <Divider />
                <Typography variant="h6" mt={2}>
                  Content
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <FormLabel sx={LabelStyle} htmlFor="theme-title">
                      Title <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="theme-title"
                      placeholder="Enter the title"
                      {...getFieldProps("title")}
                      inputProps={{ readOnly: !canEdit }}
                      error={touched?.title && errors?.title ? true : false}
                      helperText={
                        touched?.title &&
                        errors?.title &&
                        (errors?.title as string)
                      }
                    />
                  </FormControl>
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <FormLabel sx={LabelStyle} htmlFor="theme-subtext">
                      Subtext <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="theme-subtext"
                      placeholder="Enter the Subtext"
                      multiline
                      minRows={2}
                      {...getFieldProps("subtext")}
                      inputProps={{ readOnly: !canEdit }}
                      error={touched?.subtext && errors?.subtext ? true : false}
                      helperText={
                        touched?.subtext &&
                        errors?.subtext &&
                        (errors?.subtext as string)
                      }
                    />
                  </FormControl>
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <FormLabel sx={LabelStyle} htmlFor="footer">
                      Footer
                    </FormLabel>
                    <TextField
                      id="footer"
                      placeholder="Enter the footer text"
                      multiline
                      minRows={2}
                      {...getFieldProps("footer")}
                      inputProps={{ readOnly: !canEdit }}
                      error={touched?.footer && errors?.footer ? true : false}
                      helperText={
                        touched?.footer &&
                        errors?.footer &&
                        (errors?.footer as string)
                      }
                    />
                  </FormControl>
                </Box>
                <Divider sx={{ mt: 3 }} />
                <Typography variant="h6" mt={2}>
                  Logo
                </Typography>
                <Box sx={{ display: "flex", width: "40%", gap: 2, mt: 2 }}>
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <Box>
                      <FormLabel sx={LabelStyle} htmlFor="logo">
                        Header Logo
                      </FormLabel>
                      <IconButton
                        disabled={!values?.headerLogo?.url}
                        color="error"
                        onClick={() =>
                          setFieldValue("headerLogo", {
                            url: "",
                            key: "header",
                            previewUrl: "",
                          })
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <UploadImageItem
                      image={values?.headerLogo?.previewUrl}
                      name={"Header"}
                      setFieldValue={setFieldValue}
                      readOnly={!canEdit}
                      fieldName={"headerLogo"}
                      studyId={studyId}
                    />
                    <FormHelperText>
                      {touched?.headerLogo && errors?.headerLogo
                        ? (errors?.headerLogo as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <Box>
                      <FormLabel sx={LabelStyle} htmlFor="footerLogo">
                        Footer Logo
                      </FormLabel>
                      <IconButton
                        disabled={!values?.footerLogo?.url}
                        color="error"
                        onClick={() =>
                          setFieldValue("footerLogo", {
                            url: "",
                            key: "footer",
                            previewUrl: "",
                          })
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <UploadImageItem
                      image={values?.footerLogo?.previewUrl}
                      name={"Footer"}
                      setFieldValue={setFieldValue}
                      readOnly={!canEdit}
                      fieldName={"footerLogo"}
                      studyId={studyId}
                    />
                    <FormHelperText>
                      {touched?.footerLogo && errors?.footerLogo
                        ? (errors?.footerLogo as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                </Box>
                {showPreview && (
                  <ThankyouPreviewPanel
                    values={values}
                    showPreview={showPreview}
                    closePreview={closePreview}
                  />
                )}

                {canEdit && (
                  <Box sx={{ ...ModalActionButtonStyles }}>
                    {!submitLoader ? (
                      <>
                        <Button variant="contained" type="submit">
                          Save
                        </Button>
                      </>
                    ) : (
                      <CircularProgress size={25} />
                    )}
                  </Box>
                )}
              </form>
            )}
          </Formik>
        </Box>
      )}
    </Box>
  );
};

export default ThankyouPage;
