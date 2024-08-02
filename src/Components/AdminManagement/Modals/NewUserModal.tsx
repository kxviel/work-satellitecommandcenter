import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";

import * as yup from "yup";
import { FieldArray, Formik } from "formik";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../../Common/styles/modal";
import { errorToastMessage, toastMessage } from "../../../utils/toast";
import { InputWrapper, LabelStyle } from "../../Common/styles/form";
import http from "../../../utils/http";
import { useParams } from "react-router-dom";
import { Add, Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { refreshAdministratorsPage } from "../../../Redux/reducers/administratorsSlice";
import { setStateToggle } from "../../../Redux/reducers/userSlice";
import isEmail from "validator/es/lib/isEmail";

let schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is Required")
    .test("is-valid", "*Please enter a valid Email ID.", (value) =>
      value ? isEmail(value) : false
    ),
  siteRoles: yup.array().of(
    yup.object().shape({
      roleId: yup.string().trim().required("Role is Required"),
      siteIds: yup
        .array()
        .of(yup.string().required("Site is Required"))
        .min(1, "Site is required"),
    })
  ),
});

type Props = {
  showModal: boolean;
  closeModal: () => void;
  data: any;
};

const NewUserModal = ({ showModal, closeModal, data }: Props) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [sitesList, setSitesList] = useState<any[]>([]);
  const [rolesList, setRolesList] = useState<any[]>([]);
  const [userRoleList, setUserRoleList] = useState<any[]>([]);
  const { userId } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const formatSitesAndRoles = (roleSites: any) => {
    const rolesMap: any = {};

    roleSites.forEach((roleSite: any) => {
      if (rolesMap[roleSite?.role?.id]) {
        rolesMap?.[roleSite?.role?.id].siteIds?.push(roleSite?.site?.id);
      } else {
        rolesMap[roleSite?.role?.id] = {
          roleId: roleSite?.role?.id,
          siteIds: [roleSite?.site?.id],
        };
      }
    });
    return Object.values(rolesMap);
  };

  useEffect(() => {
    const fetchRolesAndSites = async () => {
      try {
        setLoading(true);
        let sitesUrl = `/study/${id}/sites`;
        let rolesUrl = `/roles?studyId=${id}`;
        const res1 = await http.get(sitesUrl);
        const res2 = await http.get(rolesUrl + `&type=site`);
        const res3 = await http.get(rolesUrl + `&type=study`);

        const sitesDataMapped = res1?.data?.data?.map((site: any) => ({
          id: site.id,
          name: site.name,
        }));

        const rolesDataMapped = res2?.data?.data?.map((role: any) => ({
          id: role.id,
          label: role.label,
        }));
        const userRolesMapped = res3?.data?.data?.map((role: any) => ({
          id: role.id,
          label: role.label,
        }));
        setSitesList(sitesDataMapped);
        setRolesList(rolesDataMapped);
        setUserRoleList(userRolesMapped);
        setLoading(false);
      } catch (err) {
        errorToastMessage(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRolesAndSites();
  }, [id]);

  const submitHandler = async (values: any) => {
    try {
      setSubmitLoader(true);
      let res: AxiosResponse;
      const body = { ...values };
      if (data?.userId) {
        delete body.email;
        res = await http.put(`/study/${id}/users/${data?.userId}`, body);
      } else {
        res = await http.post(`/study/${id}/users/add`, body);
      }
      toastMessage("success", res.data.message);
      closeModal();
      setSubmitLoader(false);
      dispatch(refreshAdministratorsPage());
      if (data?.userId === userId) {
        dispatch(setStateToggle());
      }
    } catch (err) {
      setSubmitLoader(false);
      errorToastMessage(err as Error);
    }
  };
  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={ModalBaseStyles}>
        <ModalHeader
          title={data?.userId ? "Edit User" : "New User"}
          onCloseClick={closeModal}
        />
        {!loading ? (
          <Formik
            initialValues={{
              email: data?.email || "",
              siteRoles: data?.roleSites
                ? formatSitesAndRoles(data?.roleSites)
                : [{ roleId: "", siteIds: [] }],
              studyRoleId: data?.studyRole?.role?.id || "",
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({
              handleSubmit,
              getFieldProps,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl sx={InputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="email">
                      Email Address <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      inputProps={{ readOnly: !!data?.userId }}
                      id="email"
                      {...getFieldProps("email")}
                      error={touched?.email && errors?.email ? true : false}
                      helperText={
                        touched?.email && errors?.email
                          ? (errors?.email as string)
                          : " "
                      }
                      placeholder="Enter an email address"
                    />
                  </FormControl>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl sx={InputWrapper}>
                    <FormLabel sx={LabelStyle} htmlFor="email">
                      Study Role <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <Select
                      value={values?.studyRoleId}
                      onChange={(e) =>
                        setFieldValue("studyRoleId", e.target.value)
                      }
                    >
                      {userRoleList?.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {touched?.studyRoleId && errors?.studyRoleId
                        ? (errors?.studyRoleId as string)
                        : " "}
                    </FormHelperText>
                  </FormControl>
                </Box>
                <FieldArray name="siteRoles">
                  {({ push, remove }) =>
                    values?.siteRoles?.length > 0 ? (
                      <Box>
                        {values.siteRoles?.map(
                          (roleSite: any, index: number) => {
                            const selectedRoles: string[] = [];
                            const selectedSites: string[] = [];
                            values.siteRoles?.forEach((r: any) => {
                              if (r.roleId !== roleSite.roleId) {
                                selectedRoles.push(r.roleId);
                                selectedSites.push(...r.siteIds);
                              }
                            });

                            const availableRoles = rolesList.filter(
                              (roleItem) => !selectedRoles.includes(roleItem.id)
                            );

                            const availableSites = sitesList.filter(
                              (site) => !selectedSites.includes(site.id)
                            );

                            return (
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  alignItems: "center",
                                }}
                              >
                                <FormControl sx={InputWrapper}>
                                  <FormLabel sx={LabelStyle}>
                                    Role <span style={{ color: "red" }}>*</span>
                                  </FormLabel>
                                  <Select
                                    value={roleSite?.roleId || ""}
                                    onChange={(e) => {
                                      setFieldValue(
                                        `siteRoles[${index}].roleId`,
                                        e.target.value
                                      );
                                      setFieldValue(
                                        `siteRoles[${index}].siteIds`,
                                        []
                                      );
                                    }}
                                  >
                                    {availableRoles.map((roleItem) => (
                                      <MenuItem
                                        key={roleItem.id}
                                        value={roleItem.id}
                                      >
                                        {roleItem.label}
                                      </MenuItem>
                                    ))}
                                  </Select>

                                  <FormHelperText error>
                                    {/* @ts-ignore */}
                                    {touched?.siteRoles?.[index]?.roleId &&
                                    // @ts-ignore
                                    errors?.siteRoles?.[index]?.roleId ? (
                                      <>
                                        {
                                          // @ts-ignore
                                          errors?.siteRoles?.[index]?.roleId
                                        }
                                      </>
                                    ) : (
                                      " "
                                    )}
                                  </FormHelperText>
                                </FormControl>
                                <FormControl sx={InputWrapper}>
                                  <FormLabel sx={LabelStyle}>
                                    Site(s){" "}
                                    <span style={{ color: "red" }}>*</span>
                                  </FormLabel>
                                  <Select
                                    sx={{ height: "53px" }}
                                    multiple
                                    value={roleSite.siteIds || []}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `siteRoles[${index}].siteIds`,
                                        e.target.value
                                      )
                                    }
                                    renderValue={(selected) => (
                                      <>
                                        {selected.map((value: any) => (
                                          <Box
                                            key={value}
                                            component="span"
                                            sx={{ mr: 0.5 }}
                                          >
                                            {value ? (
                                              <Chip
                                                key={value}
                                                label={
                                                  sitesList.find(
                                                    (site) => site.id === value
                                                  )?.name || value
                                                }
                                              />
                                            ) : null}
                                          </Box>
                                        ))}
                                      </>
                                    )}
                                  >
                                    {availableSites.map((site) => (
                                      <MenuItem key={site.id} value={site.id}>
                                        {site.name}
                                      </MenuItem>
                                    ))}
                                  </Select>

                                  <FormHelperText error>
                                    {/* @ts-ignore */}
                                    {touched?.siteRoles?.[index]?.siteIds &&
                                    // @ts-ignore
                                    errors?.siteRoles?.[index]?.siteIds
                                      ? // @ts-ignore
                                        errors?.siteRoles?.[index]?.siteIds
                                      : " "}
                                  </FormHelperText>
                                </FormControl>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <IconButton
                                    onClick={() =>
                                      push({ roleId: "", siteIds: [] })
                                    }
                                    disabled={
                                      rolesList?.length ===
                                        values.siteRoles?.length ||
                                      roleSite.siteIds?.length ===
                                        availableSites?.length
                                    }
                                  >
                                    <Add />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => remove(index)}
                                    color="error"
                                  >
                                    <Delete />
                                  </IconButton>
                                </Box>
                              </Box>
                            );
                          }
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ mt: 1, mb: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => push({ roleId: "", siteIds: [] })}
                        >
                          Add Role-Site pair
                        </Button>
                      </Box>
                    )
                  }
                </FieldArray>
                <Box sx={ModalActionButtonStyles}>
                  {!submitLoader ? (
                    <>
                      <Button onClick={closeModal} variant="outlined">
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        {data?.userId ? "Edit" : "Add"} User
                      </Button>
                    </>
                  ) : (
                    <CircularProgress size={25} />
                  )}
                </Box>
              </form>
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

export default NewUserModal;
