import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  // FormHelperText,
  FormLabel,
  // IconButton,
  // SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { commonContainerWrapper } from "../../Common/styles/flex";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { HalfInputWrapper, LabelStyle } from "../../Common/styles/form";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { ModalActionButtonStyles } from "../../Common/styles/modal";

type Props = {
  canEdit: boolean;
};

// const uploadWrapper: SxProps = {
//   width: 130,
//   height: 90,
//   borderRadius: "8px",
//   border: 2,
//   borderColor: "primary.main",
//   borderStyle: "dashed",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   py: 2,
//   px: 4,
//   "&:hover": {
//     bgcolor: "secondary.dark",
//     cursor: "pointer",
//   },
// };

// const UploadImageItem: React.FC<any> = ({
//   image,
//   setFieldValue,
//   readOnly,
//   name,
//   fieldName,
//   studyId,
// }) => {
//   const [loading, setLoading] = useState(false);

//   const onDrop = useCallback(
//     async (acceptedFiles: any) => {
//       try {
//         const file = acceptedFiles?.[0];
//         if (file) {
//           if (file.size > 10 * 1024 * 1024) {
//             toastMessage("warning", "File Size cannot be greater than 10 MB!");
//             return;
//           }
//           setLoading(true);
//           const url = await themeUploadUrl(file, studyId);
//           if (url) {
//             const obj = {
//               previewUrl: url?.previewUrl,
//               url: url?.postUploadImageUrl,
//             };
//             setFieldValue(fieldName, obj);
//           }
//           setLoading(false);
//         }
//       } catch (err) {
//         setLoading(false);
//         errorToastMessage(err as Error);
//       }
//     },
//     [setFieldValue, fieldName, studyId]
//   );

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop: !readOnly ? onDrop : undefined,
//     multiple: false,
//     accept: {
//       "image/jpg": [],
//       "image/jpeg": [],
//       "image/png": [],
//     },
//     noClick: readOnly,
//   });

//   return (
//     <>
//       {loading && (
//         <Backdrop
//           open={true}
//           sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         >
//           <CircularProgress color="inherit" />
//         </Backdrop>
//       )}
//       <Box
//         {...getRootProps({ className: "dropzone" })}
//         sx={{
//           ...uploadWrapper,
//         }}
//       >
//         <input {...getInputProps()} />
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             "& .preview-img": {
//               width: "130px",
//               height: "90px",
//               borderRadius: "8px",
//             },
//           }}
//         >
//           {image ? (
//             <img src={image} className="preview-img" alt={name} />
//           ) : (
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 gap: 1,
//               }}
//             >
//               <Add fontSize="medium" sx={{ color: "text.secondary" }} />
//               <Typography
//                 sx={{ color: "text.secondary" }}
//                 fontSize={12}
//                 fontWeight={600}
//                 textAlign={"center"}
//               >
//                 Upload image
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </Box>
//       <Typography variant="body1" color={"text.secondary"} mt={2} width={"75%"}>
//         Image size - 258x70px, 10MB Max
//       </Typography>
//     </>
//   );
// };

const formatWelcomeEmailData = (data: any) => {
  const formattedData: any = {
    subject: data?.subject,
    body: data?.body,
    signature: data?.signature,
    // image: data?.images?.find((img: any) => img.key === "image1"),
  };
  return formattedData;
};

const schema = yup.object().shape({
  subject: yup.string().required("Email subject is required"),
  body: yup.string().required("Email body is required"),
  signature: yup.string().required("Email signature is required"),
  //   image: yup.object().shape({
  //     url: yup.string().optional().nullable(),
  //     previewUrl: yup.string().optional().nullable(),
  //     key: yup.string().optional().nullable(),
  //   }),
});

const WelcomeEmail = ({ canEdit }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [data, setData] = useState<any>(null);
  const { id: studyId } = useParams();

  useEffect(() => {
    const getWelcomeEmailData = async () => {
      try {
        setLoading(true);
        const res: AxiosResponse = await http.get(
          `/study/${studyId}/settings/email-templates/participant_welcome`
        );
        const data = res?.data?.data;
        const newData = formatWelcomeEmailData(data);
        setData(newData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    if (studyId) {
      getWelcomeEmailData();
    }
  }, [studyId, toggleLoader]);

  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };

  async function handleSubmit(values: any) {
    setSubmitLoader(true);
    try {
      const body: any = {
        subject: values?.subject,
        body: values?.body,
        signature: values?.signature,

        // images: [
        //   values?.image?.url && {
        //     url: values?.image?.postUploadImageUrl ?? values?.image?.url,
        //     key: "image1",
        //   },
        // ].filter(Boolean),
      };

      const res: AxiosResponse = await http.post(
        `/study/${studyId}/settings/email-templates/participant_welcome`,
        body
      );
      toastMessage("success", res?.data?.message);
      setSubmitLoader(false);
      refreshPage();
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  }

  return (
    <Box sx={{ ...commonContainerWrapper }}>
      {loading ? (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress />
        </Backdrop>
      ) : (
        <Box>
          <Formik
            initialValues={{
              subject: data?.subject || "",
              body: data?.body || "",
              signature: data?.signature || "",
              //   image: data?.image || {
              //     url: "",
              //     previewUrl: "",
              //     key: "image",
              //   },
            }}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
            validationSchema={schema}
          >
            {({
              getFieldProps,
              handleSubmit,
              touched,
              errors,
              setFieldValue,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <div>
                  <Typography variant="h6">Content</Typography>
                </div>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <FormLabel sx={LabelStyle} htmlFor="subject">
                      Subject <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="subject"
                      {...getFieldProps("subject")}
                      placeholder="Enter email subject"
                      inputProps={{ readOnly: !canEdit }}
                      error={touched.subject && errors.subject ? true : false}
                      helperText={
                        touched?.subject &&
                        errors?.subject &&
                        (errors?.subject as string)
                      }
                    />
                  </FormControl>
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <FormLabel sx={LabelStyle} htmlFor="body">
                      Body <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="body"
                      multiline
                      minRows={2}
                      {...getFieldProps("body")}
                      placeholder="Enter email body"
                      inputProps={{ readOnly: !canEdit }}
                      error={touched.body && errors.body ? true : false}
                      helperText={
                        touched?.body &&
                        errors?.body &&
                        (errors?.body as string)
                      }
                    />
                  </FormControl>
                  <FormControl sx={{ ...HalfInputWrapper }}>
                    <FormLabel sx={LabelStyle} htmlFor="signature">
                      Signature <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="signature"
                      {...getFieldProps("signature")}
                      placeholder="Enter email signature"
                      inputProps={{ readOnly: !canEdit }}
                      error={
                        touched.signature && errors.signature ? true : false
                      }
                      helperText={
                        touched?.signature &&
                        errors?.signature &&
                        (errors?.signature as string)
                      }
                    />
                  </FormControl>
                  {/* <FormControl sx={{ ...HalfInputWrapper }}>
                    <Box>
                      <FormLabel sx={LabelStyle} htmlFor="image">
                        Image
                      </FormLabel>
                      <IconButton
                        disabled={!values?.image?.url}
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
                      image={values?.image?.previewUrl}
                      name={"Header"}
                      setFieldValue={setFieldValue}
                      readOnly={!canEdit}
                      fieldName={"headerLogo"}
                      studyId={studyId}
                    />
                    <FormHelperText>
                      {touched?.image && errors?.image
                        ? (errors?.image as string)
                        : " "}
                    </FormHelperText>
                  </FormControl> */}
                </Box>
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

export default WelcomeEmail;
