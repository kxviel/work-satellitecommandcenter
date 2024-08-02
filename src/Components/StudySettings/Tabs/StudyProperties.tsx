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
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { HalfInputWrapper, LabelStyle } from "../../Common/styles/form";
import { CustomSliderStyle } from "../style";
import { useParams } from "react-router-dom";
import { commonContainerWrapper } from "../../Common/styles/flex";
import { ModalActionButtonStyles } from "../../Common/styles/modal";

const studyIndustryOptions = [
  { label: "CRO", value: "cro" },
  { label: "University", value: "university" },
  { label: "Hospital", value: "hospital" },
  { label: "Pharma", value: "pharma" },
  { label: "Biotech", value: "biotech" },
  { label: "Medical Device", value: "medical_device" },
  { label: "Other", value: "other" },
];

const studyCategoryOptions = [
  {
    label: "Feasibility",
    value: "feasibility",
  },
  {
    label: "Pre-clinical",
    value: "pre-clinical",
  },
  {
    label: "Phase0",
    value: "phase0",
  },
  {
    label: "Phase1",
    value: "phase1",
  },
  {
    label: "Phase2",
    value: "phase2",
  },
  {
    label: "Phase3",
    value: "phase3",
  },
  {
    label: "Phase4",
    value: "phase4",
  },
  {
    label: "PostMarketing",
    value: "post_marketing",
  },
  {
    label: "Investigator Initiated Study",
    value: "investigator_initiated_study",
  },
  {
    label: "Observational",
    value: "observational",
  },
  {
    label: "Other",
    value: "other",
  },
];

const studyDesignRadioOptions = [
  { label: "Prospective", value: "prospective" },
  { label: "Retrospective", value: "retrospective" },
  { label: "Registry", value: "registry" },
  { label: "Other", value: "other" },
];
const sponsorTypeRadioOptions = [
  { label: "Non-commercial", value: "Non-commercial" },
  { label: "Non-commercial, funded", value: "Non-commercial,funded" },
  { label: "Commercial", value: "Commercial" },
];
const schema = yup.object().shape({
  sponsor: yup.string().optional(),
  sponsorIndustry: yup.string().optional(),
  sponsorType: yup.string().optional(),
  studyFunder: yup.string().optional(),
  studyCategory: yup.string().optional(),
  approvalStudy: yup.string().optional(),
  therapeuticArea: yup.string().optional(),
  studyDesign: yup.string().optional(),
  inclusions: yup.string().optional(),
  durationMonths: yup.string().optional(),
  centers: yup.string().optional(),
  randomization: yup.string().optional(),
  requireAccessCode: yup.string().optional(),
});
type Props = {
  canEdit: boolean;
};
const StudyProperties = ({ canEdit }: Props) => {
  const { id } = useParams();
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchStudyPropertiesData = async () => {
      try {
        setLoading(true);
        let url = `/study/${id}`;
        const res: AxiosResponse = await http.get(url);
        const data = res.data?.data?.properties;
        setData(data || {});
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchStudyPropertiesData();
  }, [setLoading, id]);

  const submitHandler = async (values: any) => {
    try {
      setButtonLoader(true);
      const body: any = {
        ...values,
      };
      let res: AxiosResponse;
      res = await http.put(`/study/${id}/properties`, body);

      toastMessage("success", res.data.message);
      setButtonLoader(false);
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
      const data = res.data?.data?.properties;
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
              sponsor: data?.sponsor || "",
              sponsorIndustry: data?.sponsorIndustry || "cro",
              sponsorType: data?.sponsorType || "",
              studyFunder: data?.studyFunder || "",
              studyCategory: data?.studyCategory || "feasibility",
              approvalStudy: data?.approvalStudy || "",
              therapeuticArea: data?.therapeuticArea || "",
              studyDesign: data?.studyDesign || "",
              inclusions: data?.inclusions || 5,
              durationMonths: data?.durationMonths || 12,
              centers: data?.centers || 1,
              randomization: data?.randomization || false,
              requireAccessCode: data?.requireAccessCode || false,
            }}
            validationSchema={schema}
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
                    <Typography variant="h6" mb={1}>
                      Sponsor (GCP)
                    </Typography>
                    <FormLabel
                      sx={{ ...LabelStyle, fontWeight: 400, fontSize: 16 }}
                      htmlFor="sponsor"
                    >
                      The institution responsible for the initiation, management
                      and/or financing of the study
                    </FormLabel>
                    <TextField
                      id="sponsor"
                      placeholder="Sponsor"
                      inputProps={{ readOnly: !canEdit }}
                      {...getFieldProps("sponsor")}
                      error={touched?.sponsor && errors?.sponsor ? true : false}
                      helperText={
                        touched?.sponsor && errors?.sponsor
                          ? errors?.sponsor
                          : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="sponsor-industry">
                      Sponsor Industry
                    </FormLabel>
                    <Select
                      value={values.sponsorIndustry}
                      onChange={(e) => {
                        setFieldValue("sponsorIndustry", e.target.value);
                      }}
                      fullWidth
                      id="sponsor-industry"
                      readOnly={!canEdit}
                    >
                      {studyIndustryOptions.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText
                      error={
                        touched?.sponsorIndustry && errors?.sponsorIndustry
                          ? true
                          : false
                      }
                    >
                      {touched?.sponsorIndustry && errors?.sponsorIndustry
                        ? (errors?.sponsorIndustry as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                  <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} id="sponsor-type">
                      Sponsor Type
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="sponsor-type"
                      name="sponsor-type"
                      value={values?.sponsorType}
                      onChange={(event) => {
                        setFieldValue("sponsorType", event.target.value);
                      }}
                    >
                      {sponsorTypeRadioOptions.map((option) => (
                        <FormControlLabel
                          key={option.label}
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
                      ))}
                    </RadioGroup>
                    <FormHelperText
                      error={
                        touched?.sponsorType && errors?.sponsorType
                          ? true
                          : false
                      }
                    >
                      {touched?.sponsorType && errors?.sponsorType
                        ? (errors?.sponsorType as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                  <FormControl sx={HalfInputWrapper}>
                    <Typography variant="h6" mb={1}>
                      Study Funder
                    </Typography>
                    <FormLabel
                      sx={{ ...LabelStyle, fontWeight: 400, fontSize: 16 }}
                      htmlFor="studyFunder"
                    >
                      The organization financing this study
                    </FormLabel>
                    <TextField
                      id="studyFunder"
                      placeholder="Study funder"
                      inputProps={{ readOnly: !canEdit }}
                      {...getFieldProps("studyFunder")}
                      error={
                        touched?.studyFunder && errors?.studyFunder
                          ? true
                          : false
                      }
                      helperText={
                        touched?.studyFunder && errors?.studyFunder
                          ? errors?.studyFunder
                          : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="study-category">
                      Study Category
                    </FormLabel>
                    <Select
                      value={values.studyCategory}
                      onChange={(e) => {
                        setFieldValue("studyCategory", e.target.value);
                      }}
                      fullWidth
                      id="study-category"
                      displayEmpty
                      readOnly={!canEdit}
                      renderValue={
                        values.studyCategory !== ""
                          ? undefined
                          : () => (
                              <Typography sx={{ color: "#c1cccf" }}>
                                Select
                              </Typography>
                            )
                      }
                    >
                      {studyCategoryOptions.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText
                      error={
                        touched?.studyCategory && errors?.studyCategory
                          ? true
                          : false
                      }
                    >
                      {touched?.studyCategory && errors?.studyCategory
                        ? (errors?.studyCategory as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                  <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="approval-study">
                      Approval Study
                    </FormLabel>
                    <TextField
                      id="approval-study"
                      placeholder="Approval study"
                      inputProps={{ readOnly: !canEdit }}
                      {...getFieldProps("approvalStudy")}
                      error={
                        touched?.approvalStudy && errors?.approvalStudy
                          ? true
                          : false
                      }
                      helperText={
                        touched?.approvalStudy && errors?.approvalStudy
                          ? errors?.approvalStudy
                          : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={HalfInputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="therapeutic-area">
                      Therapeutic Area
                    </FormLabel>
                    <TextField
                      id="therapeutic-area"
                      placeholder="Therapeutic area"
                      inputProps={{ readOnly: !canEdit }}
                      {...getFieldProps("therapeuticArea")}
                      error={
                        touched?.therapeuticArea && errors?.therapeuticArea
                          ? true
                          : false
                      }
                      helperText={
                        touched?.therapeuticArea && errors?.therapeuticArea
                          ? errors?.therapeuticArea
                          : " "
                      }
                    />
                  </FormControl>
                  <FormControl sx={HalfInputWrapper}>
                    <FormLabel
                      sx={{
                        ...LabelStyle,
                        fontWeight: "500",
                        fontSize: "20px",
                      }}
                      id="study-design"
                    >
                      Study Design
                    </FormLabel>
                    <Typography variant="subtitle1">
                      If unsure, select “other”
                    </Typography>
                    <RadioGroup
                      aria-labelledby="study-design"
                      name="study-design"
                      value={values?.studyDesign}
                      onChange={(event) => {
                        setFieldValue("studyDesign", event.target.value);
                      }}
                    >
                      {studyDesignRadioOptions.map((option) => (
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
                      error={
                        touched?.studyDesign && errors?.studyDesign
                          ? true
                          : false
                      }
                    >
                      {touched?.studyDesign && errors?.studyDesign
                        ? (errors?.studyDesign as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                    sx={{ ...HalfInputWrapper, width: "40%", mb: 2 }}
                  >
                    <FormLabel sx={LabelStyle} htmlFor="inclusions">
                      Inclusions
                    </FormLabel>
                    <Typography>{values.inclusions}</Typography>
                    <Slider
                      id="inclusions"
                      sx={CustomSliderStyle}
                      min={0}
                      max={1100}
                      step={5}
                      disabled={!canEdit}
                      valueLabelDisplay="auto"
                      value={values.inclusions}
                      onChange={(e, value) =>
                        setFieldValue("inclusions", value)
                      }
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1">
                        Upto {values?.inclusions}
                      </Typography>
                      <Typography variant="subtitle1">1000+</Typography>
                    </Box>
                  </FormControl>
                  <FormControl
                    sx={{ ...HalfInputWrapper, width: "40%", mb: 2 }}
                  >
                    <FormLabel sx={LabelStyle} htmlFor="duration-in-months">
                      Duration in Months
                    </FormLabel>
                    <Typography>{values.durationMonths}</Typography>
                    <Slider
                      id="duration-in-months"
                      sx={CustomSliderStyle}
                      min={0}
                      max={120}
                      step={1}
                      valueLabelDisplay="auto"
                      value={values.durationMonths}
                      disabled={!canEdit}
                      onChange={(e, value) =>
                        setFieldValue("durationMonths", value)
                      }
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1">
                        {values?.durationMonths} Months
                      </Typography>
                      <Typography variant="subtitle1">120 Months</Typography>
                    </Box>
                  </FormControl>
                  <FormControl
                    sx={{ ...HalfInputWrapper, width: "40%", mb: 2 }}
                  >
                    <FormLabel sx={LabelStyle} htmlFor="centers">
                      Centers
                    </FormLabel>
                    <Typography>{values.centers}</Typography>
                    <Slider
                      id="centers"
                      sx={CustomSliderStyle}
                      min={1}
                      max={11}
                      step={1}
                      disabled={!canEdit}
                      valueLabelDisplay="auto"
                      value={values.centers}
                      onChange={(e, value) => setFieldValue("centers", value)}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1">
                        {values?.centers}
                      </Typography>
                      <Typography variant="subtitle1">10+</Typography>
                    </Box>
                  </FormControl>

                  <FormControl sx={HalfInputWrapper}>
                    <Box>
                      <FormControlLabel
                        disabled={!canEdit}
                        label={
                          <Typography
                            fontSize={16}
                            fontWeight={500}
                            color="text.primary"
                          >
                            Randomization
                          </Typography>
                        }
                        control={
                          <Checkbox
                            checked={values?.randomization === true}
                            onChange={(event) => {
                              setFieldValue(
                                "randomization",
                                event.target.checked
                              );
                            }}
                          />
                        }
                      />
                      <Typography variant="subtitle1" sx={{ ml: 4 }}>
                        Weighted variable block randomization with optional
                        stratification.
                      </Typography>
                      <Typography variant="subtitle1" sx={{ ml: 4 }}>
                        We recommend keeping the 'Confirm changes' option
                        enabled when using randomization.
                      </Typography>
                    </Box>
                    <FormHelperText
                      error={
                        touched?.randomization && errors?.randomization
                          ? true
                          : false
                      }
                    >
                      {touched?.randomization && errors?.randomization
                        ? (errors?.randomization as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                  <FormControl sx={HalfInputWrapper}>
                    <Box>
                      <FormControlLabel
                        disabled={!canEdit}
                        label={
                          <Typography
                            fontSize={16}
                            fontWeight={500}
                            color="text.primary"
                          >
                            Require access code(s) for web surveys
                          </Typography>
                        }
                        control={
                          <Checkbox
                            checked={values?.requireAccessCode === true}
                            onChange={(event) => {
                              setFieldValue(
                                "requireAccessCode",
                                event.target.checked
                              );
                            }}
                          />
                        }
                      />
                      <Typography variant="subtitle1" sx={{ ml: 4 }}>
                        Using access codes will require participants to enter a
                        code sent to the email address associated with their
                        Survey package invitation when they open a survey. This
                        will not apply to surveys configured as an ‘Open survey
                        link‘.
                      </Typography>
                    </Box>
                    <FormHelperText
                      error={
                        touched?.requireAccessCode && errors?.requireAccessCode
                          ? true
                          : false
                      }
                    >
                      {touched?.requireAccessCode && errors?.requireAccessCode
                        ? (errors?.requireAccessCode as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
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

export default StudyProperties;
