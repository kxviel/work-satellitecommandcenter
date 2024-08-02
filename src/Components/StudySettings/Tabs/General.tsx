import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Form, Formik } from "formik";
import * as yup from "yup";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  // FormControlLabel,
  // FormHelperText,
  FormLabel,
  IconButton,
  // Radio,
  // RadioGroup,
  TextField,
  // Typography,
} from "@mui/material";
import { HalfInputWrapper, LabelStyle } from "../../Common/styles/form";
import { CopyContentIcon } from "../Icons";
import { useParams } from "react-router-dom";
import { commonContainerWrapper } from "../../Common/styles/flex";
import { ModalActionButtonStyles } from "../../Common/styles/modal";
import isEmail from "validator/es/lib/isEmail";
import { setStateToggle } from "../../../Redux/reducers/userSlice";
import { useAppDispatch } from "../../../Redux/hooks";
// import ConfirmStudyLiveModal from "../Modals/ConfirmStudyLiveModal";

// const studyTypesRadioOptions = [
//   {
//     label: "Production",
//     value: "production",
//     description: "for real participant data",
//   },
//   {
//     label: "Test",
//     value: "test",
//     description: "to try study structures, etc,",
//   },
//   {
//     label: "Example",
//     value: "example",
//     description: "used as a reference to be shown",
//   },
// ];

// const statusRadioOptions = [
//   { label: "Live", value: "live" },
//   { label: "Not Live", value: "not_live" },
// ];
const schema = yup.object().shape({
  name: yup.string().required("Study name is Required"),
  mahaloStudyId: yup.string().optional(),
  trialRegistryId: yup.string().optional(),
  mainContactName: yup.string().required("Main contact name is Required"),
  mainContactEmail: yup
    .string()
    .required("Main contact Email ID is Required")
    .test("is-valid", "*Please enter a valid Email ID.", (value) =>
      value ? isEmail(value) : false
    ),
  // type: yup.string().required("Types of study is Required"),
  // status: yup.string().required("Status is Required"),
  imageUrl: yup.string().optional(),
});
type Props = {
  canEdit: boolean;
};

const General = ({ canEdit }: Props) => {
  const { id } = useParams();
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        setLoading(true);
        let url = `/study/${id}`;
        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data;
        setData(data || {});
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchGeneralData();
  }, [setLoading, id]);

  const submitHandler = async (values: any) => {
    try {
      setButtonLoader(true);
      const body: any = {
        name: values?.name,
        trialRegistryId: values?.trialRegistryId,
        mainContactName: values?.mainContactName,
        mainContactEmail: values?.mainContactEmail,
        // type: values?.type,
        // status: values?.status,
      };
      // body.imageUrl = values?.imageUrl || undefined;
      let res: AxiosResponse;

      res = await http.put(`/study/${id}/general`, body);

      toastMessage("success", res.data.message);
      setButtonLoader(false);
      dispatch(setStateToggle());
    } catch (err) {
      setButtonLoader(false);
      errorToastMessage(err as Error);
    }
  };
  const handleCancel = async () => {
    try {
      setLoading(true);
      let url = `/study/${id}`;
      const res: AxiosResponse = await http.get(url);
      const data = res.data?.data;
      setData(data || {});
      setLoading(false);
    } catch (err) {
      setLoading(false);
      errorToastMessage(err as Error);
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
        <Box sx={commonContainerWrapper}>
          <Formik
            initialValues={{
              name: data?.name || "",
              mahaloStudyId: data?.id || "",
              trialRegistryId: data?.trialRegistryId || "",
              mainContactName: data?.mainContactName || "",
              mainContactEmail: data?.mainContactEmail || "",
              // type: data?.type || "",
              // status: data?.status || "",
              // imageUrl: data?.imageUrl || "",
            }}
            validationSchema={canEdit ? schema : undefined}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({
              errors,
              touched,
              setFieldValue,
              getFieldProps,
              values,
            }: any) => (
              <Form>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="name">
                      Study Name <span style={{ color: "#f16262" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="name"
                      placeholder="Study name"
                      {...getFieldProps("name")}
                      inputProps={{ readOnly: !canEdit }}
                      error={touched?.name && errors?.name ? true : false}
                      helperText={
                        touched?.name && errors?.name ? errors?.name : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={{ ...HalfInputWrapper, mb: 2 }}>
                    <FormLabel sx={LabelStyle} htmlFor="mahalo-study-id">
                      Mahalo Study ID
                    </FormLabel>

                    <TextField
                      id="mahalo-study-id"
                      placeholder="Study ID"
                      value={values?.mahaloStudyId}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            edge="end"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                values?.mahaloStudyId
                              );
                              toastMessage("success", "Copied!");
                            }}
                          >
                            <CopyContentIcon />
                          </IconButton>
                        ),
                        readOnly: !canEdit,
                      }}
                    />
                  </FormControl>
                  {/* <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="trial-registry-id">
                      Trial Registry ID
                    </FormLabel>
                    <TextField
                      id="trial-registry-id"
                      placeholder="Trial registry ID"
                      {...getFieldProps("trialRegistryId")}
                      inputProps={{ readOnly: !canEdit }}
                      error={
                        touched?.trialRegistryId && errors?.trialRegistryId
                          ? true
                          : false
                      }
                      helperText={
                        touched?.trialRegistryId && errors?.trialRegistryId
                          ? errors?.trialRegistryId
                          : " "
                      }
                     
                    />
                  </FormControl> */}

                  <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="main-contact-name">
                      Main Contact Name{" "}
                      <span style={{ color: "#f16262" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="main-contact-name"
                      placeholder="Main contact name"
                      {...getFieldProps("mainContactName")}
                      inputProps={{ readOnly: !canEdit }}
                      error={
                        touched?.mainContactName && errors?.mainContactName
                          ? true
                          : false
                      }
                      helperText={
                        touched?.mainContactName && errors?.mainContactName
                          ? errors?.mainContactName
                          : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="main-contact-email">
                      Main Contact Email{" "}
                      <span style={{ color: "#f16262" }}>*</span>
                    </FormLabel>
                    <TextField
                      id="main-contact-email"
                      placeholder="Main contact email"
                      {...getFieldProps("mainContactEmail")}
                      inputProps={{ readOnly: !canEdit }}
                      error={
                        touched?.mainContactEmail && errors?.mainContactEmail
                          ? true
                          : false
                      }
                      helperText={
                        touched?.mainContactEmail && errors?.mainContactEmail
                          ? errors?.mainContactEmail
                          : " "
                      }
                    />
                  </FormControl>
                  {/* <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} id="type-of-study">
                      Types of study <span style={{ color: "#f16262" }}>*</span>
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="type-of-study"
                      name="type-of-study"
                      value={values?.type}
                      onChange={(event) => {
                        setFieldValue("type", event.target.value);
                      }}
                    >
                      {studyTypesRadioOptions.map((option, index) => (
                        <Box key={option.value} mt={index === 0 ? 0 : 1}>
                          <FormControlLabel
                            value={option.value}
                            control={<Radio sx={{ color: "#9CA3AF" }} />}
                            disabled={!canEdit}
                            label={
                              <Typography
                                fontSize={16}
                                fontWeight={500}
                                color="text.primary"
                              >
                                {option.label}
                              </Typography>
                            }
                          />
                          <Typography
                            variant="subtitle1"
                            color="#4B5563"
                            sx={{ ml: 4 }}
                          >
                            {option.description}
                          </Typography>
                        </Box>
                      ))}
                    </RadioGroup>
                    <FormHelperText
                      error={touched?.type && errors?.type ? true : false}
                    >
                      {touched?.type && errors?.type
                        ? (errors?.type as string)
                        : " "}
                    </FormHelperText>
                  </FormControl> */}
                  {/* <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} id="status">
                      Status <span style={{ color: "#f16262" }}>*</span>
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="status"
                      name="status"
                      value={values?.status}
                      onChange={(event) => {
                        setFieldValue("status", event.target.value);
                        // if (event.target.value === "live") {
                        //   setConfirmLive(true);
                        // } else {
                        //   setFieldValue("status", event.target.value);
                        // }
                      }}
                    >
                      {statusRadioOptions.map((option) => (
                        <FormControlLabel
                          key={option.label}
                          value={option.value}
                          disabled={!canEdit}
                          control={<Radio sx={{ color: "#9CA3AF" }} />}
                          label={
                            <Typography
                              fontSize={16}
                              fontWeight={500}
                              color="text.primary"
                            >
                              {option.label}
                            </Typography>
                          }
                        />
                      ))}
                    </RadioGroup>
                    <FormHelperText
                      error={touched?.status && errors?.status ? true : false}
                    >
                      {touched?.status && errors?.status
                        ? (errors?.status as string)
                        : " "}
                    </FormHelperText>
                  </FormControl> */}
                  {/* <FormControl sx={HalfInputWrapper}>
                    <Typography
                      fontWeight={500}
                      fontSize={16}
                      color="text.primary"
                    >
                      Logo
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <UploadItem
                        image={values?.imageUrl}
                        setFieldValue={setFieldValue}
                      />
                      {values?.imageUrl ? (
                        <Typography variant="subtitle1" color="text.secondary">
                          File selected
                        </Typography>
                      ) : (
                        <Typography
                          variant="subtitle1"
                          colo="text.secondary"
                          sx={{ fontStyle: "italic" }}
                        >
                          No file selected
                        </Typography>
                      )}
                    </Box>
                  </FormControl> */}

                  {canEdit && (
                    <Box sx={ModalActionButtonStyles}>
                      {!buttonLoader ? (
                        <>
                          <Button variant="outlined" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button variant="contained" type="submit">
                            Save
                          </Button>
                        </>
                      ) : (
                        <CircularProgress size={25} />
                      )}
                    </Box>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </>
  );
};

export default General;
