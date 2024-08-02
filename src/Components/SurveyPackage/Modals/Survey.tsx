import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { AxiosResponse } from "axios";
import http from "../../../utils/http";
import { errorToastMessage, toastMessage } from "../../../utils/toast";

let schema = yup.object().shape({
  phaseId: yup.string().required("Please select one to continue"),
});

const Survey = ({
  showModal,
  closeModal,
  packageId,
  studyId,
  refreshPage,
  menuLabels,
}: any) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [surveyList, setSurveyList] = useState<any>([]);

  useEffect(() => {
    const fetchPhaseData = async () => {
      try {
        setLoading(true);
        const surveyListRes: AxiosResponse = await http.get(
          `/study/${studyId}/study-phase?category=survey`
        );
        const surveyRes = surveyListRes.data?.data;

        const listData = surveyRes?.map((item: any) => ({
          id: item?.id,
          name: item?.name || "",
        }));
        setSurveyList(listData);
        setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setLoading(false);
      }
    };
    fetchPhaseData();
  }, [studyId]);
  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      const body = {
        ...values,
      };
      let res: AxiosResponse;
      res = await http.post(
        `/study/${studyId}/survey-package/${packageId}/package_link`,
        body
      );

      closeModal();
      toastMessage("success", res?.data?.message);
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
          title={`Add ${menuLabels?.survey || "Survey"}`}
          onCloseClick={closeModal}
        />
        {!loading ? (
          <Formik
            initialValues={{
              phaseId: "",
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form>
                <FormControl sx={InputWrapper}>
                  <FormLabel sx={LabelStyle}>
                    {menuLabels?.survey || "Survey"} Selection{" "}
                    <span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <Select
                    fullWidth
                    value={values.phaseId}
                    onChange={(e) => {
                      setFieldValue("phaseId", e.target.value);
                    }}
                    error={touched?.phaseId && errors?.phaseId ? true : false}
                    displayEmpty
                    renderValue={
                      values.phaseId !== ""
                        ? undefined
                        : () => (
                            <Typography sx={{ color: "#c1cccf" }}>
                              Select
                            </Typography>
                          )
                    }
                  >
                    {surveyList.length > 0 ? (
                      surveyList.map((option: any) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No options available</MenuItem>
                    )}
                  </Select>
                  <FormHelperText
                    error={touched?.phaseId && errors?.phaseId ? true : false}
                  >
                    {touched?.phaseId && errors?.phaseId
                      ? (errors?.phaseId as string)
                      : " "}
                  </FormHelperText>
                </FormControl>
                <Box sx={ModalActionButtonStyles}>
                  {!submitLoader ? (
                    <>
                      <Button onClick={closeModal} variant="outlined">
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        Add
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
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress size={25} />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default Survey;
