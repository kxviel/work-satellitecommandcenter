import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  MenuItem,
  Modal,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { setParticipantFilter } from "../../../Redux/reducers/participantsSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { ClearIcon } from "@mui/x-date-pickers";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  studyId: any;
};
const statusOptions = [
  { label: "Included", value: "included" },
  { label: "Excluded", value: "excluded" },
  { label: "Unverified", value: "unverified" },
];
const lockedParticipantOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

let schema = yup.object().shape({
  siteIds: yup.array().of(yup.string().optional()),
  status: yup.string().optional(),
  isLocked: yup.string().optional(),
});

const ParticipantFilterModal = ({ showModal, closeModal, studyId }: Props) => {
  const dispatch = useAppDispatch();
  const { siteIds, status, isLocked } = useAppSelector(
    (state) => state.participants
  );
  const { sitesList } = useAppSelector((state) => state.user);

  const submitHandler = async (values: any) => {
    dispatch(
      setParticipantFilter({
        siteIds: values?.siteIds,
        status: values?.status,
        isLocked: values?.isLocked,
      })
    );
    closeModal();
  };
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "20vh" }}>
        <ModalHeader title={"Filter By"} onCloseClick={closeModal} />
        <Formik
          initialValues={{
            siteIds: siteIds || [],
            status: status || "",
            isLocked: isLocked || "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            submitHandler(values);
          }}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              <FormControl sx={InputWrapper}>
                <FormLabel sx={LabelStyle}>Site</FormLabel>
                <Select
                  fullWidth
                  multiple
                  value={values.siteIds}
                  onChange={(e) => {
                    setFieldValue("siteIds", e.target.value);
                  }}
                  error={touched?.siteIds && errors?.siteIds ? true : false}
                  displayEmpty
                  renderValue={
                    values.siteIds.length > 0
                      ? (selected) =>
                          selected
                            .map((id) => {
                              const site = sitesList.find(
                                (site: any) => site.id === id
                              );
                              return site ? site.name : "";
                            })
                            .join(", ")
                      : () => (
                          <Typography sx={{ color: "#c1cccf" }}>
                            Select
                          </Typography>
                        )
                  }
                  endAdornment={
                    values.siteIds?.length > 0 && (
                      <InputAdornment
                        sx={{ marginRight: "10px" }}
                        position="end"
                      >
                        <IconButton
                          onClick={() => {
                            setFieldValue("siteIds", []);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                >
                  {sitesList.length > 0 ? (
                    sitesList.map((option: any) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No options available</MenuItem>
                  )}
                </Select>
                <FormHelperText
                  error={touched?.siteIds && errors?.siteIds ? true : false}
                >
                  {touched?.siteIds && errors?.siteIds
                    ? (errors?.siteIds as string)
                    : " "}
                </FormHelperText>
              </FormControl>
              <FormControl sx={InputWrapper}>
                <FormLabel sx={LabelStyle}>Participant Status</FormLabel>
                <Select
                  value={values.status}
                  onChange={(e) => {
                    setFieldValue("status", e.target.value);
                  }}
                  fullWidth
                  id="status"
                  displayEmpty
                  renderValue={
                    values.status !== ""
                      ? undefined
                      : () => (
                          <Typography sx={{ color: "#c1cccf" }}>
                            Select
                          </Typography>
                        )
                  }
                  endAdornment={
                    values.status !== "" && (
                      <InputAdornment
                        sx={{ marginRight: "10px" }}
                        position="end"
                      >
                        <IconButton
                          onClick={() => {
                            setFieldValue("status", "");
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
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
              </FormControl>
              <FormControl sx={InputWrapper}>
                <FormLabel sx={LabelStyle}>Is Participant Locked</FormLabel>
                <Select
                  value={values.isLocked}
                  onChange={(e) => {
                    setFieldValue("isLocked", e.target.value);
                  }}
                  fullWidth
                  id="is-locked"
                  endAdornment={
                    values.isLocked && (
                      <InputAdornment
                        sx={{ marginRight: "10px" }}
                        position="end"
                      >
                        <IconButton
                          onClick={() => {
                            setFieldValue("isLocked", "");
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                >
                  {lockedParticipantOptions.map((option: any) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText
                  error={touched?.isLocked && errors?.isLocked ? true : false}
                >
                  {touched?.isLocked && errors?.isLocked
                    ? (errors?.isLocked as string)
                    : " "}
                </FormHelperText>
              </FormControl>

              <Box sx={ModalActionButtonStyles}>
                <>
                  <Button
                    onClick={() => {
                      setFieldValue("siteIds", []);
                      setFieldValue("status", "");
                      setFieldValue("isLocked", "");
                    }}
                    variant="outlined"
                  >
                    Clear All
                  </Button>
                  <Button onClick={closeModal} variant="outlined">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    Apply
                  </Button>
                </>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default ParticipantFilterModal;
