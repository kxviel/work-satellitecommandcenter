import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import { Form, Formik } from "formik";
import { AxiosResponse } from "axios";
import http from "../../utils/http";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import { InputWrapper, LabelStyle } from "../Common/styles/form";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../Common/styles/modal";

// const statusOptions = [
//   { label: "Active", value: "active" },
//   { label: "Inactive", value: "inactive" },
// ];

// const studyTypeOptions = [
//   { label: "Production", value: "production" },
//   { label: "Test", value: "test" },
//   { label: "Example", value: "example" },
// ];

let schema = yup.object().shape({
  name: yup
    .string()
    .required("Study Name is Required")
    .min(4, "Study Name must be at least 4 Characters Long"),
  siteName: yup.string().required("Site Name is Required"),
  siteAbbreviation: yup.string().required("Site Abbreviation is Required"),
  // type: yup.string().required("Study Type is Required"),
  countryId: yup.string().required("Country is Required"),
  // status: yup.string().required("Status is Required"),
});

type Props = {
  showModal: boolean;
  closeModal: () => void;
  data: any;
  refreshPage: () => void;
};

const AddNewStudyModal = ({
  showModal,
  closeModal,
  data,
  refreshPage,
}: Props) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countriesList, setCountriesList] = useState<any[]>([]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const res: AxiosResponse = await http.get(`/data/countries`);
        const newData = res?.data?.data?.map((country: any) => ({
          value: country?.valueId,
          label: country?.label,
        }));
        setCountriesList(newData);
        setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);
  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body = {
        name: values?.name,
        site: {
          name: values?.siteName,
          abbreviation: values?.siteAbbreviation,
          countryId: values?.countryId,
        },
        // type: values?.type,
        status: values?.status,
      };
      let res: AxiosResponse;
      if (data?.id) {
        res = await http.patch(`/study/${data?.id}`, body);
      } else {
        res = await http.post(`/study`, body);
      }

      toastMessage("success", res?.data?.message);
      closeModal();
      setSubmitLoader(false);
      refreshPage();
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <ModalHeader
          title={data?.id ? "Edit Study" : "New Study"}
          onCloseClick={closeModal}
        />
        {!loading ? (
          <Formik
            initialValues={{
              name: data?.studyName || "",
              siteName: data?.siteName || "",
              siteAbbreviation: data?.abbreviation || "",
              // type: data?.type || "test",
              countryId: data?.countryId || "",
              // status: data?.status || "active",
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({ getFieldProps, errors, touched, setFieldValue, values }) => (
              <Form>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="study-name">
                    Study Name <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder="Study name"
                    id="study-name"
                    {...getFieldProps("name")}
                    error={touched?.name && errors?.name ? true : false}
                    helperText={
                      touched?.name && errors?.name
                        ? (errors?.name as string)
                        : " "
                    }
                  />
                </FormControl>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="site-name">
                    Site Name <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder="Site name"
                    id="site-name"
                    {...getFieldProps("siteName")}
                    error={touched?.siteName && errors?.siteName ? true : false}
                    helperText={
                      touched?.siteName && errors?.siteName
                        ? (errors?.siteName as string)
                        : " "
                    }
                  />
                </FormControl>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="site-abbreviation">
                    Site Abbreviation <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder="Site abbreviation"
                    id="site-abbreviation"
                    {...getFieldProps("siteAbbreviation")}
                    error={
                      touched?.siteAbbreviation && errors?.siteAbbreviation
                        ? true
                        : false
                    }
                    helperText={
                      touched?.siteAbbreviation && errors?.siteAbbreviation
                        ? (errors?.siteAbbreviation as string)
                        : " "
                    }
                    inputProps={{ maxLength: 6 }}
                  />
                </FormControl>
                {/* <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="study-type">
                    Study Type <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select
                    value={values.type}
                    onChange={(e) => {
                      setFieldValue("type", e.target.value);
                    }}
                    fullWidth
                    id="study-type"
                  >
                    {studyTypeOptions.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    error={touched?.type && errors?.type ? true : false}
                  >
                    {touched?.type && errors?.type
                      ? (errors?.type as string)
                      : " "}
                  </FormHelperText>
                </FormControl> */}
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="country-id">
                    Country <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select
                    value={values.countryId}
                    onChange={(e) => {
                      setFieldValue("countryId", e.target.value);
                    }}
                    fullWidth
                    id="country-id"
                  >
                    {countriesList.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    error={
                      touched?.countryId && errors?.countryId ? true : false
                    }
                  >
                    {touched?.countryId && errors?.countryId
                      ? (errors?.countryId as string)
                      : " "}
                  </FormHelperText>
                </FormControl>
                {/* <FormControl sx={InputWrapper}>
                <FormLabel sx={LabelStyle} htmlFor="status">
                  Status <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Select
                  value={values.status}
                  onChange={(e) => {
                    setFieldValue("status", e.target.value);
                  }}
                  fullWidth
                  id="status"
                >
                  {statusOptions.map((option: any) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText
                  error={touched?.status && errors?.status ? true : false}
                >
                  {touched?.status && errors?.status
                    ? (errors?.status as string)
                    : " "}
                </FormHelperText>
              </FormControl> */}

                <Box sx={ModalActionButtonStyles}>
                  {!submitLoader ? (
                    <>
                      <Button onClick={closeModal} variant="outlined">
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        Save
                      </Button>
                    </>
                  ) : (
                    <CircularProgress size={25} />
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <CircularProgress size={25} />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AddNewStudyModal;
