import {
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  SxProps,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { Form, Formik } from "formik";
import React, { ChangeEvent, useEffect, useState } from "react";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import { AxiosResponse } from "axios";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import http from "../../../utils/http";
import { commonContainerWrapper } from "../../Common/styles/flex";
import { Close } from "@mui/icons-material";
import { StyledTableCell } from "../../Common/styles/table";
import { useParams } from "react-router-dom";
import UploadIcon from "@mui/icons-material/Upload";
import { UploadErrorIcon } from "../Icons";

let schema = yup.object().shape({
  seedVal: yup
    .number()
    .typeError("Seed Value must be a number")
    .required("Seed Value is Required"),
  groups: yup
    .string()
    .required("Treatment groups is Required")
    .test(
      "comma-separated-values",
      "Groups should be comma-separated",
      (value) => {
        const regex = /^\s*[^,\s]+(?:\s*,\s*[^,\s]+)*\s*$/;
        return regex.test(value);
      }
    )
    .test(
      "atleast-two-groups",
      "At least 2 groups should exist separated by comma",
      (value) => {
        return value.split(",").length > 1;
      }
    ),
  blockSizes: yup
    .string()
    .required("Block sizes is Required")
    .test(
      "comma-separated-numbers",
      "Block sizes must be a comma-separated list of numbers",
      (value) => {
        const regex = /^\s*\d+(\s*,\s*\d+)*\s*$/;
        return regex.test(value);
      }
    ),
  listLength: yup
    .number()
    .typeError("List length must be a number")
    .required("List length is Required"),
});

export const ChipStyle: SxProps = {
  fontSize: 14,
  fontWeight: 500,
  paddingBlock: "20px",
  paddingRight: "7px",
  backgroundColor: "secondary.main",
  color: "text.primary",
  border: "none",
  borderRadius: "8px",
  textTransform: "capitalize",
  "& .MuiSvgIcon-root": {
    color: "#374151",
    fontSize: "16px",
  },
};

type Props = {
  canEdit: boolean;
};

const Randomization = ({ canEdit }: Props) => {
  const [data, setData] = useState<any>([]);
  const [randomizationData, setRandomizationData] = useState<any>([]);
  const [simulatedData, setSimulatedData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [saveListLoader, setSaveListLoader] = useState(false);
  const [csvLoader, setCsvLoader] = useState(false);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [showSaveList, setShowSaveList] = useState(false);
  const [creationMode, setCreationMode] = useState("");

  const { id: studyId } = useParams();

  const refreshPage = () => {
    setToggleLoader((prev) => !prev);
  };

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      let updatedGroups = values?.groups?.split(",").map((item: string) => {
        return { name: item.trim() };
      });

      let updatedSizes = values?.blockSizes
        ?.split(",")
        .map((item: string) => +item);

      const body = {
        studyId: studyId ?? "",
        treatmentGroups: updatedGroups || [],
        blockSizes: updatedSizes || [],
        totalSubjects: +values?.listLength || "",
        seed: +values?.seedVal || "",
      };
      let res: AxiosResponse;
      res = await http.post(`/randomization/simulate`, body);

      const newData = res?.data?.data?.map((item: any) => ({
        subjectId: item?.subjectId,
        blockId: item?.blockId || "",
        treatmentGroupName: item?.treatmentGroupName || "",
        blockSize: item?.blockSize || "",
      }));

      setSimulatedData(body);
      setShowSaveList(true);
      setData(newData);
      toastMessage("success", res?.data?.message);
      setSubmitLoader(false);
    } catch (err) {
      errorToastMessage(err as Error);
      setSubmitLoader(false);
    }
  };

  const saveList = async () => {
    try {
      setSaveListLoader(true);

      let res: AxiosResponse;
      res = await http.post(`/randomization`, simulatedData);
      toastMessage("success", res?.data?.message);
      refreshPage();
      setShowSaveList(false);
      setSaveListLoader(false);
    } catch (err) {
      errorToastMessage(err as Error);
      setSaveListLoader(false);
    }
  };

  const uploadCSV = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toastMessage("warning", "File size must smaller than 5MB!");
        return false;
      }
      try {
        setCsvLoader(true);
        setUploadError(false);
        const formData = new FormData();
        formData.append("file", file);
        let res: AxiosResponse;
        res = await http.post(
          `/randomization/import?studyId=${studyId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toastMessage("success", res?.data?.message);
        refreshPage();
        setCsvLoader(false);
      } catch (err) {
        errorToastMessage(err as Error);
        setUploadError(true);
        setCsvLoader(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `/randomization?studyId=${studyId}`;

        const res: AxiosResponse = await http.get(url);
        const resData = res?.data?.data;

        const newData = {
          seedVal:
            resData?.creationMode === "file_upload" ? "" : resData?.seed || "",
          groups:
            resData?.treatmentGroups
              ?.map(
                (obj: { treatmentGroupName: string }) => obj.treatmentGroupName
              )
              .join(", ") || "",
          blockSizes: resData?.blockSizes.join(", ") || "",
          listLength: resData?.totalSubjects || "",
          creationMode: resData?.creationMode || "",
        };

        const sData = {
          seed: resData?.seed || "",
          blockSizes: resData?.blockSizes || [],
          studyId: studyId,
          totalSubjects: resData?.totalSubjects || "",
          treatmentGroups: resData?.treatmentGroups?.map(
            (obj: { treatmentGroupName: string }) => {
              return {
                name: obj.treatmentGroupName,
              };
            }
          ),
        };

        setSimulatedData(sData);
        setCreationMode(newData?.creationMode);
        setRandomizationData(newData || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchData();
  }, [toggleLoader, studyId]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        let url = `/randomization/list?studyId=${studyId}`;

        const res: AxiosResponse = await http.get(url);
        const resData = res?.data?.data;

        const newData = resData?.map((item: any) => ({
          subjectId: item?.randomizationNumber,
          blockId: item?.blockId || "",
          treatmentGroupName: item?.treatmentGroupName || "",
          blockSize: item?.blockSize || "",
        }));

        setData(newData);
      } catch (err) {
        errorToastMessage(err as Error);
      }
    };
    fetchTableData();
  }, [toggleLoader, studyId]);

  const downloadCSV = () => {
    const CSVData = [
      {
        randomizationNumber: 1,
        treatmentGroupName: "SLI",
        blockId: 1,
        blockSize: 4,
      },
      {
        randomizationNumber: 2,
        treatmentGroupName: "SLI",
        blockId: 1,
        blockSize: 4,
      },
      {
        randomizationNumber: 3,
        treatmentGroupName: "SGI",
        blockId: 1,
        blockSize: 4,
      },
      {
        randomizationNumber: 4,
        treatmentGroupName: "SGI",
        blockId: 1,
        blockSize: 4,
      },
    ];

    let csvContent = "data:text/csv;charset=utf-8,";

    const headers = Object.keys(CSVData[0]);
    csvContent += headers.join(",") + "\r\n";

    CSVData.forEach(function (object: any) {
      let row = headers
        .map((header) => {
          return object[header];
        })
        .join(",");
      csvContent += row + "\r\n";
    });

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "randomization.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ ...commonContainerWrapper, display: "flex", gap: 3 }}>
      {loading ? (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box width={"35%"}>
            <Formik
              initialValues={{
                seedVal: randomizationData?.seedVal || "",
                groups: randomizationData?.groups || "",
                blockSizes: randomizationData?.blockSizes || "",
                listLength: randomizationData?.listLength || "",
                creationMode: randomizationData?.creationMode || "",
              }}
              validationSchema={schema}
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
                resetForm,
              }) => (
                <Form>
                  {/* {values?.creationMode === "file_upload" ? (
                    <>
                      <FormControl sx={{ ...InputWrapper, mb: 3 }}>
                        <FormLabel sx={LabelStyle} htmlFor="file-name">
                          Name of the file
                        </FormLabel>
                        <TextField
                          placeholder="Name of the file"
                          id="file-name"
                          {...getFieldProps("fileName")}
                          error={
                            touched?.fileName && errors?.fileName ? true : false
                          }
                          helperText={
                            touched?.fileName &&
                            errors?.fileName &&
                            (errors?.fileName as string)
                          }
                          disabled
                        />
                      </FormControl>

                      <FormControl sx={{ ...InputWrapper, mb: 3 }}>
                        <FormLabel sx={LabelStyle} htmlFor="date">
                          Date
                        </FormLabel>
                        <TextField
                          placeholder="Enter Date"
                          id="date"
                          {...getFieldProps("date")}
                          error={touched?.date && errors?.date ? true : false}
                          helperText={
                            touched?.date &&
                            errors?.date &&
                            (errors?.date as string)
                          }
                          disabled
                        />
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <FormControl sx={{ ...InputWrapper, mb: 3 }}>
                        <FormLabel sx={LabelStyle} htmlFor="seed-value">
                          Seed Value <span style={{ color: "red" }}>*</span>
                        </FormLabel>
                        <TextField
                          placeholder="Enter seed value"
                          id="seed-value"
                          {...getFieldProps("seedVal")}
                          error={
                            touched?.seedVal && errors?.seedVal ? true : false
                          }
                          helperText={
                            touched?.seedVal &&
                            errors?.seedVal &&
                            (errors?.seedVal as string)
                          }
                        />
                      </FormControl>

                      <FormControl sx={{ ...InputWrapper, mb: 3 }}>
                        <FormLabel sx={LabelStyle} htmlFor="treatment-groups">
                          Treatment groups{" "}
                          <span style={{ color: "red" }}>*</span>
                        </FormLabel>
                        <TextField
                          placeholder="study name"
                          id="treatment-groups"
                          {...getFieldProps("groups")}
                          error={
                            touched?.groups && errors?.groups ? true : false
                          }
                          helperText={
                            touched?.groups &&
                            errors?.groups &&
                            (errors?.groups as string)
                          }
                        />
                        <Typography color={"text.secondary"} fontSize={"14px"}>
                          For 2:1 ratio enter same treatment group twice.
                        </Typography>
                        <Typography color={"text.secondary"} fontSize={"14px"}>
                          Eg A, A, B
                        </Typography>

                        {values.groups && (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "30% 30% 30%",
                              gap: 2,
                              mt: 2.5,
                            }}
                          >
                            {values?.groups?.split(",").map(
                              (item: string) =>
                                item.trim() !== "" && (
                                  <Chip
                                    label={item}
                                    key={item}
                                    sx={ChipStyle}
                                    deleteIcon={
                                      <Close
                                        htmlColor="#374151"
                                        fontSize="small"
                                      />
                                    }
                                    onDelete={() => {
                                      const data = values.groups
                                        ?.split(",")
                                        .filter((group: any) => group !== item);
                                      setFieldValue("groups", data.join(", "));
                                    }}
                                  />
                                )
                            )}
                          </Box>
                        )}
                      </FormControl>
                    </>
                  )} */}

                  <FormControl sx={{ ...InputWrapper, mb: 3 }}>
                    <FormLabel sx={LabelStyle} htmlFor="seed-value">
                      Seed Value <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      placeholder="Enter seed value"
                      id="seed-value"
                      inputProps={{ readOnly: !canEdit }}
                      {...getFieldProps("seedVal")}
                      error={touched?.seedVal && errors?.seedVal ? true : false}
                      helperText={
                        touched?.seedVal &&
                        errors?.seedVal &&
                        (errors?.seedVal as string)
                      }
                      disabled={values?.creationMode === "file_upload"}
                    />
                  </FormControl>

                  <FormControl sx={{ ...InputWrapper, mb: 3 }}>
                    <FormLabel sx={LabelStyle} htmlFor="treatment-groups">
                      Treatment groups <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      placeholder="study name"
                      id="treatment-groups"
                      inputProps={{ readOnly: !canEdit }}
                      {...getFieldProps("groups")}
                      error={touched?.groups && errors?.groups ? true : false}
                      helperText={
                        touched?.groups &&
                        errors?.groups &&
                        (errors?.groups as string)
                      }
                      disabled={values?.creationMode === "file_upload"}
                    />
                    <Typography color={"text.secondary"} fontSize={"14px"}>
                      For 2:1 ratio enter same treatment group twice.
                    </Typography>
                    <Typography color={"text.secondary"} fontSize={"14px"}>
                      Eg A, A, B
                    </Typography>

                    {values.groups && (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "30% 30% 30%",
                          gap: 2,
                          mt: 2.5,
                        }}
                      >
                        {values?.groups?.split(",").map(
                          (item: string) =>
                            item.trim() !== "" && (
                              <Chip
                                label={item}
                                key={item}
                                sx={ChipStyle}
                                deleteIcon={
                                  <Close htmlColor="#374151" fontSize="small" />
                                }
                                onDelete={() => {
                                  const data = values.groups
                                    ?.split(",")
                                    .filter((group: any) => group !== item);
                                  setFieldValue("groups", data.join(", "));
                                }}
                                disabled={
                                  values?.creationMode === "file_upload"
                                }
                              />
                            )
                        )}
                      </Box>
                    )}
                  </FormControl>

                  <FormControl sx={{ ...InputWrapper, mb: 3 }}>
                    <FormLabel sx={LabelStyle} htmlFor="block-sizes">
                      Block Sizes <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      placeholder="2,4"
                      id="block-sizes"
                      inputProps={{ readOnly: !canEdit }}
                      {...getFieldProps("blockSizes")}
                      error={
                        touched?.blockSizes && errors?.blockSizes ? true : false
                      }
                      helperText={
                        touched?.blockSizes &&
                        errors?.blockSizes &&
                        (errors?.blockSizes as string)
                      }
                      disabled={values?.creationMode === "file_upload"}
                    />
                    <Typography color={"text.secondary"} fontSize={"14px"}>
                      A comma seperated list of block sizes- must be multiples
                      of the number of treatments
                    </Typography>
                  </FormControl>

                  <FormControl sx={{ ...InputWrapper, mb: 3 }}>
                    <FormLabel sx={LabelStyle} htmlFor="list-length">
                      List length <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      placeholder="Enter list length"
                      inputProps={{ readOnly: !canEdit }}
                      id="list-length"
                      {...getFieldProps("listLength")}
                      error={
                        touched?.listLength && errors?.listLength ? true : false
                      }
                      helperText={
                        touched?.listLength &&
                        errors?.listLength &&
                        (errors?.listLength as string)
                      }
                      disabled={values?.creationMode === "file_upload"}
                    />
                    <Typography color={"text.secondary"} fontSize={"14px"}>
                      E.g 3 age groups and 4 sites is 3 x 5 = 15 strata
                    </Typography>
                  </FormControl>

                  {canEdit && (
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1.5,
                      }}
                    >
                      {!submitLoader ? (
                        <>
                          {values?.creationMode === "file_upload" ? (
                            !csvLoader ? (
                              <Button variant="outlined" component="label">
                                <span>Upload another file</span>
                                <input
                                  hidden
                                  accept="text/csv"
                                  type="file"
                                  onChange={uploadCSV}
                                />
                              </Button>
                            ) : (
                              <CircularProgress size={25} />
                            )
                          ) : (
                            <>
                              {(values.seedVal ||
                                values.listLength ||
                                values.blockSizes ||
                                values.groups) && (
                                <Button
                                  variant="outlined"
                                  onClick={() =>
                                    resetForm({
                                      values: {
                                        seedVal: "",
                                        groups: "",
                                        blockSizes: "",
                                        listLength: "",
                                        creationMode: "",
                                      },
                                    })
                                  }
                                >
                                  Clear
                                </Button>
                              )}
                              <Button
                                type="submit"
                                variant="contained"
                                disabled={csvLoader || uploadError}
                              >
                                Randomize
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        <CircularProgress size={25} />
                      )}
                    </Box>
                  )}
                </Form>
              )}
            </Formik>
          </Box>

          <Box>
            <Divider
              orientation="vertical"
              sx={{ borderColor: "#D9D9D9", height: "100%", mx: 1 }}
            />
          </Box>
          {data?.length > 0 && (
            <Box width={"60%"}>
              <Box
                sx={{
                  maxHeight: "calc(100vh - 295px)",
                  overflow: "auto",
                  mb: 2,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>
                        <Box display={"flex"} alignItems={"center"}>
                          ID
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box display={"flex"} alignItems={"center"}>
                          Block ID
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box display={"flex"} alignItems={"center"}>
                          Block Size
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box display={"flex"} alignItems={"center"}>
                          Group
                        </Box>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data?.map((row: any) => (
                      <TableRow key={row?.subjectId}>
                        <StyledTableCell>{row?.subjectId}</StyledTableCell>
                        <StyledTableCell>{row?.blockId}</StyledTableCell>
                        <StyledTableCell>{row?.blockSize}</StyledTableCell>
                        <StyledTableCell>
                          {row?.treatmentGroupName}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              {creationMode !== "file_upload" && showSaveList && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                  }}
                >
                  {!saveListLoader ? (
                    <Button variant="outlined" onClick={() => saveList()}>
                      Save List
                    </Button>
                  ) : (
                    <CircularProgress size={25} />
                  )}
                  <Button variant="outlined">Download as CSV</Button>
                </Box>
              )}
            </Box>
          )}
          {data.length === 0 && (
            <Box
              sx={{
                backgroundColor: "#fff",
                width: "60%",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!csvLoader && !uploadError ? (
                <>
                  <Typography
                    fontSize={"16px"}
                    fontWeight={"500"}
                    color="text.secondary"
                  >
                    I already have my randomized data.
                  </Typography>
                  <Typography
                    fontSize={"16px"}
                    fontWeight={"500"}
                    color="text.secondary"
                    mb={3}
                  >
                    I want to use my data to randomize the patients
                  </Typography>

                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                  >
                    <span>Upload File</span>
                    <input
                      hidden
                      accept="text/csv"
                      type="file"
                      onChange={uploadCSV}
                    />
                  </Button>
                  <Button
                    onClick={downloadCSV}
                    variant="outlined"
                    sx={{ mt: 2 }}
                  >
                    Download Sample CSV
                  </Button>
                </>
              ) : uploadError ? (
                <>
                  <UploadErrorIcon />
                  <Typography
                    fontSize={"16px"}
                    fontWeight={"500"}
                    color="#F05252"
                    mt={2}
                    mb={3}
                  >
                    Uploading failed/wrong data/no data
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                  >
                    <span>Retry uploading</span>
                    <input
                      hidden
                      accept="text/csv"
                      type="file"
                      onChange={uploadCSV}
                    />
                  </Button>
                </>
              ) : (
                <>
                  <CircularProgress size={25} />
                  <Typography
                    fontSize={"16px"}
                    fontWeight={"500"}
                    color="text.secondary"
                    mt={2}
                  >
                    Uploading your file.. please wait
                  </Typography>
                </>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Randomization;
