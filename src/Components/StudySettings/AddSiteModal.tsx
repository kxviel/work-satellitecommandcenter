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
import { useAppDispatch } from "../../Redux/hooks";
import { setStateToggle } from "../../Redux/reducers/userSlice";

let schema = yup.object().shape({
  name: yup.string().required("Site Name is Required"),
  siteAbbreviation: yup.string().required("Site Abbreviation is Required"),
  siteCountry: yup.string().required("Site Country is Required"),
  siteCode: yup.string().optional(),
  // dateFormat: yup.string().required("Date format is Required"),
});

const AddSiteModal = ({ showModal, closeModal, data, studyId }: any) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const dispatch = useAppDispatch();
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
        name: values?.name || "",
        countryId: values?.siteCountry || "",
        code: values?.siteCode || "",
        abbreviation: values?.siteAbbreviation || "",
        // dateFormat: values?.dateFormat || "",
      };
      let res: AxiosResponse;
      if (data?.id) {
        res = await http.put(`/study/${studyId}/sites/${data.id}`, body);
      } else {
        res = await http.post(`/study/${studyId}/sites`, body);
      }
      toastMessage("success", res?.data?.message);
      closeModal();
      setSubmitLoader(false);
      dispatch(setStateToggle());
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <ModalHeader
          title={data?.id ? "Edit Site" : "Add Site"}
          onCloseClick={closeModal}
        />
        {!loading ? (
          <Formik
            initialValues={{
              name: data?.siteName || "",
              siteCountry: data?.countryId || "",
              siteCode: data?.code || "",
              siteAbbreviation: data?.abbreviation || "",
              // dateFormat: data?.dateFormat || "",
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({ getFieldProps, errors, touched, setFieldValue, values }) => (
              <Form>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="site-name">
                    Site Name <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder="Site name"
                    id="site-name"
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
                  <FormLabel sx={LabelStyle} htmlFor="site-country">
                    Site Country <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select
                    value={values?.siteCountry || ""}
                    onChange={(e) =>
                      setFieldValue("siteCountry", e.target.value)
                    }
                  >
                    {countriesList?.map((item: any) => (
                      <MenuItem key={item?.value} value={item?.value}>
                        {item?.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {touched?.siteCountry && errors?.siteCountry
                      ? (errors?.siteCountry as string)
                      : " "}
                  </FormHelperText>
                </FormControl>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl sx={InputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="site-code">
                      Site Code
                    </FormLabel>
                    <TextField
                      placeholder="Site code"
                      id="site-code"
                      {...getFieldProps("siteCode")}
                      error={
                        touched?.siteCode && errors?.siteCode ? true : false
                      }
                      helperText={
                        touched?.siteCode && errors?.siteCode
                          ? (errors?.siteCode as string)
                          : " "
                      }
                      inputProps={{ maxLength: 6 }}
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
                </Box>

                {/* <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle} htmlFor="date-format">
                    Date Format <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    placeholder="YYYY-MM-DD"
                    id="date-format"
                    {...getFieldProps("dateFormat")}
                    error={
                      touched?.dateFormat && errors?.dateFormat ? true : false
                    }
                    helperText={
                      touched?.dateFormat && errors?.dateFormat
                        ? (errors?.dateFormat as string)
                        : " "
                    }
                  />
                </FormControl> */}

                <Box sx={ModalActionButtonStyles}>
                  {!submitLoader ? (
                    <>
                      <Button onClick={closeModal} variant="outlined">
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        {data?.id ? "Save" : "Create"}
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

export default AddSiteModal;
