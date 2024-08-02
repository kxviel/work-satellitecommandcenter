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
import * as yup from "yup";
import React, { useCallback, useEffect, useState } from "react";
import { commonContainerWrapper } from "../../Common/styles/flex";
import { useParams } from "react-router-dom";
import { FieldArray, Formik } from "formik";
import { LabelStyle, HalfInputWrapper } from "../../Common/styles/form";
import { useDropzone } from "react-dropzone";
import { Add, Delete } from "@mui/icons-material";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { themeUploadUrl } from "../../../utils/upload";
// import AuthPreviewWrapper from "./Modals/AuthPreviewWrapper";
import { ModalActionButtonStyles } from "../../Common/styles/modal";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import AuthPreviewPanel from "./Modals/AuthPreviewPanel";

type Props = {
  canEdit: boolean;
};

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
const UploadImageItem: React.FC<any> = ({
  image,
  setFieldValue,
  readOnly,
  name,
  fieldName,
  studyId,
  index,
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
              key: `logo_${index}`,
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
    [setFieldValue, fieldName, studyId, index]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: !readOnly ? onDrop : undefined,
    multiple: false,
    accept: {
      "image/jpg": [],
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
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
    </>
  );
};

const layoutList = [
  { value: "layout_1", label: "Layout 1" },
  { value: "layout_2", label: "Layout 2" },
  { value: "layout_3", label: "Layout 3" },
  { value: "layout_4", label: "Layout 4" },
  { value: "layout_5", label: "Layout 5" },
];

const formatThemeData = (data: any) => {
  const formattedData: any = {
    title: data?.content?.title,
    subtext: data?.content?.subtext,
    theme: data?.colorHexCode,
    layout: data?.layoutKey,
    images: {
      topRight: data?.images?.find((img: any) => img.key === "topRight"),
      bottomLeft: data?.images?.find((img: any) => img.key === "bottomLeft"),
    },
    logos: [
      data?.logos?.find((img: any) => img.key === "logo_1") || {
        key: "logo_1",
        url: "",
        previewUrl: "",
      },
      data?.logos?.find((img: any) => img.key === "logo_2") || {
        key: "logo_2",
        url: "",
        previewUrl: "",
      },
    ],
  };
  return formattedData;
};

let schema = yup.object().shape({
  title: yup.string().trim().optional(),
  subtext: yup.string().trim().optional(),
  layout: yup.string().trim().required("Theme layout is required"),
  images: yup.object().shape({
    topRight: yup.object().shape({
      url: yup.string().optional().nullable(),
      previewUrl: yup.string().optional().nullable(),
      key: yup.string().optional().nullable(),
    }),
    bottomLeft: yup.object({
      url: yup.string().optional().nullable(),
      previewUrl: yup.string().optional().nullable(),
      key: yup.string().optional().nullable(),
    }),
  }),
  logos: yup.array().of(
    yup.object().shape({
      url: yup.string().optional().nullable(),
      previewUrl: yup.string().optional().nullable(),
      key: yup.string().optional().nullable(),
    })
  ),
});
const AuthPage = ({ canEdit }: Props) => {
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
        let url = `/ui/pages?studyId=${studyId}&pageKey=admin_login`;

        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;
        const newData = formatThemeData(data);
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
        studyId,
        layoutKey: values?.layout,
        pageKey: "admin_login",
        colorHexCode: values?.theme,
        images: [
          values?.images?.topRight?.url && {
            url: values?.images?.topRight?.url,
            key: "topRight",
          },
          values?.images?.bottomLeft?.url &&
            values?.layout === "layout_1" && {
              url: values?.images?.bottomLeft?.url,
              key: "bottomLeft",
            },
        ].filter(Boolean),
        logos: !(values?.layout === "layout_1")
          ? [{ url: values?.logos?.[0]?.url, key: "logo_1" }]
          : values?.logos
              ?.map((logo: any, index: number) => ({
                url: logo?.url,
                key: `logo_${index + 1}`,
              }))
              .filter((logo: any) => logo.url),
        content: {
          title: values?.title,
          subtext: values?.subtext,
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
              layout: data?.layout || "layout_1",
              images: {
                topRight: data?.images?.topRight || {
                  url: "",
                  key: "topRight",
                  previewUrl: "",
                },
                bottomLeft: data?.images?.bottomLeft || {
                  url: "",
                  key: "bottomLeft",
                  previewUrl: "",
                },
              },
              logos: data?.logos?.length > 0 ? data?.logos : [],
            }}
            onSubmit={(values) => {
              submitHandler(values);
            }}
            validationSchema={schema}
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
                  <Typography variant="h6" mb={2}>
                    Theme
                  </Typography>
                  <Button variant="contained" onClick={showPreviewModal}>
                    Preview
                  </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <FormLabel sx={LabelStyle} htmlFor="theme-layout">
                      Theme Layout <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <Select
                      value={values?.layout}
                      onChange={(e) => {
                        setFieldValue("layout", e.target.value);
                        // setFieldValue(`logos`, [
                        //   {
                        //     key: `logo_1`,
                        //     url: "",
                        //     previewUrl: "",
                        //   },
                        //   {
                        //     key: `logo_2`,
                        //     url: "",
                        //     previewUrl: "",
                        //   },
                        // ]);
                        // setFieldValue("images", {
                        //   topRight: {
                        //     url: "",
                        //     key: "topRight",
                        //     previewUrl: "",
                        //   },
                        //   bottomLeft: {
                        //     url: "",
                        //     key: "bottomLeft",
                        //     previewUrl: "",
                        //   },
                        // });
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
                  {/* <FormControl sx={{ ...HalfInputWrapper, mb: 2 }}>
                    <FormLabel sx={LabelStyle} htmlFor="theme-color">
                      Color <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="theme-color"
                      placeholder="Select a color"
                      value={values?.theme}
                      inputProps={{ readOnly: true }}
                      onClick={openModal}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ColorBox
                              style={{ backgroundColor: values?.theme }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      error={touched?.theme && errors?.theme ? true : false}
                      helperText={
                        touched?.theme &&
                        errors?.theme &&
                        (errors?.theme as string)
                      }
                    />
                  </FormControl> */}
                </Box>
                <Divider sx={{ mt: 2 }} />
                <Typography variant="h6" mt={2}>
                  Images
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    maxWidth: "500px",
                    gap: 2,
                    mt: 2,
                    mb: 1,
                  }}
                >
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <Box>
                      <FormLabel sx={LabelStyle} htmlFor="image-2">
                        Image 1
                      </FormLabel>
                      <IconButton
                        sx={{ mb: 1 }}
                        disabled={!values?.images?.topRight?.url}
                        color="error"
                        onClick={() =>
                          setFieldValue("images.topRight", {
                            url: "",
                            key: "topRight",
                            previewUrl: "",
                          })
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <UploadImageItem
                      image={values?.images?.topRight?.previewUrl || ""}
                      setFieldValue={setFieldValue}
                      readOnly={!canEdit}
                      name={"Top right"}
                      fieldName={"images.topRight"}
                      studyId={studyId}
                    />
                    <FormHelperText>
                      {touched?.images?.topRight && errors?.images?.topRight
                        ? (errors?.images?.topRight as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                  {values?.layout === "layout_1" && (
                    <FormControl sx={{ ...HalfInputWrapper }}>
                      <Box>
                        <FormLabel sx={LabelStyle} htmlFor="image-2">
                          Image 2
                        </FormLabel>
                        <IconButton
                          sx={{ mb: 1 }}
                          color="error"
                          disabled={!values?.images?.bottomLeft?.url}
                          onClick={() =>
                            setFieldValue(
                              "images.bottomLeft",

                              {
                                url: "",
                                key: "bottomLeft",
                                previewUrl: "",
                              }
                            )
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      <UploadImageItem
                        image={values?.images?.bottomLeft?.previewUrl || ""}
                        name={"Bottom left"}
                        setFieldValue={setFieldValue}
                        readOnly={!canEdit}
                        fieldName={"images.bottomLeft"}
                        studyId={studyId}
                      />
                      <FormHelperText>
                        {touched?.images?.bottomLeft &&
                        errors?.images?.bottomLeft
                          ? (errors?.images?.bottomLeft as string)
                          : " "}
                      </FormHelperText>
                    </FormControl>
                  )}
                </Box>
                <Typography variant="body1" color={"text.secondary"}>
                  Image size - 258x70px, 10MB Max
                </Typography>
                <Divider sx={{ mt: 2 }} />
                <Typography variant="h6" mt={2}>
                  Logos
                </Typography>
                <FieldArray name="logos">
                  {({ push, remove }) => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 2,
                          mb: 1,
                          gap: 16,
                        }}
                      >
                        {values?.logos?.map((logo: any, index: number) => (
                          <Box key={`logo_${index + 1}`}>
                            <FormControl>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <FormLabel
                                  sx={{ ...LabelStyle }}
                                  htmlFor={`logo-${index + 1}`}
                                >
                                  Logo {index + 1}
                                </FormLabel>
                                <IconButton
                                  disabled={!logo?.url}
                                  sx={{ mb: 1 }}
                                  color="error"
                                  onClick={() =>
                                    setFieldValue(`logos.${index}`, {
                                      key: `logo_${index + 1}`,
                                      url: "",
                                      previewUrl: "",
                                    })
                                  }
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <UploadImageItem
                                  image={logo?.previewUrl}
                                  name={`Logo ${index + 1}`}
                                  setFieldValue={setFieldValue}
                                  readOnly={!canEdit}
                                  fieldName={`logos.${index}`}
                                  studyId={studyId}
                                  index={index + 1}
                                />
                              </Box>
                              <FormHelperText>
                                {/* @ts-ignore */}
                                {touched?.logos?.[index] &&
                                // @ts-ignore
                                errors?.logos?.[index]
                                  ? // @ts-ignore

                                    errors?.logos?.[index]
                                  : " "}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        ))}
                      </Box>
                      {/* {values?.layout === "layout_1" && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 3,
                          }}
                        >
                          <IconButton
                            onClick={() => push({ url: "", key: "" })}
                            disabled={!canEdit || values?.logos?.length === 2}
                          >
                            <Add />
                          </IconButton>
                          {values?.logos?.length > 0 && (
                            <IconButton
                              onClick={() => {
                                remove(values.logos.length - 1);
                              }}
                              disabled={!canEdit || values?.logos?.length === 1}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </Box>
                      )} */}
                    </Box>
                  )}
                </FieldArray>
                <Typography variant="body1" color={"text.secondary"}>
                  Image size - 258x70px, 10MB Max
                </Typography>
                {values?.layout === "layout_1" && (
                  <>
                    <Divider sx={{ mt: 2 }} />
                    <Typography variant="h6" mt={2}>
                      Content
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        mb: 3,
                        mt: 3,
                      }}
                    >
                      <FormControl sx={{ ...HalfInputWrapper }}>
                        <FormLabel sx={LabelStyle} htmlFor="theme-title">
                          Title
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
                      <FormControl sx={{ ...HalfInputWrapper, mt: 3 }}>
                        <FormLabel sx={LabelStyle} htmlFor="theme-subtext">
                          Subtitle
                        </FormLabel>
                        <TextField
                          id="theme-subtext"
                          placeholder="Enter the subtext"
                          multiline
                          minRows={2}
                          {...getFieldProps("subtext")}
                          inputProps={{ readOnly: !canEdit }}
                          error={
                            touched?.subtext && errors?.subtext ? true : false
                          }
                          helperText={
                            touched?.subtext &&
                            errors?.subtext &&
                            (errors?.subtext as string)
                          }
                        />
                      </FormControl>
                    </Box>
                  </>
                )}
                {showPreview && (
                  <AuthPreviewPanel
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

export default AuthPage;
