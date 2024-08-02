import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Modal,
} from "@mui/material";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../Common/styles/modal";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import http from "../../utils/http";
import { useParams } from "react-router-dom";
import { ExpandMore, ChevronRight } from "@mui/icons-material";

type Props = {
  showModal: boolean;
  closeModal: () => void;
};

const ExportAllModal = ({ showModal, closeModal }: Props) => {
  const { id: studyId } = useParams();
  const [submitLoader, setSubmitLoader] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<any>({});

  const submitHandler = async () => {
    try {
    } catch (err) {
      setSubmitLoader(false);
      errorToastMessage(err as Error);
    }
  };

  useEffect(() => {
    const fetchPhaseData = async () => {
      try {
        setLoading(true);
        const res1: AxiosResponse = await http.get(
          `/study/${studyId}/study-phase?category=visit`
        );
        const res2: AxiosResponse = await http.get(
          `/study/${studyId}/study-phase?category=repeated_data`
        );
        const res3: AxiosResponse = await http.get(
          `/study/${studyId}/study-phase?category=survey`
        );

        const formattedData1 = res1.data?.data?.map((item: any) => ({
          id: item?.id,
          category: item?.category,
          name: item?.name || "",
          selected: "no",
          expanded: false,
          forms: item?.phaseForms?.map((item: any) => ({
            id: item?.form?.id,
            name: item?.form?.name,
            selected: false,
            expanded: false,
          })),
        }));
        const formattedData2 = res2.data?.data?.map((item: any) => ({
          id: item?.id,
          category: item?.category,
          name: item?.name || "",
          selected: "no",
          expanded: false,
          forms: item?.phaseForms?.map((item: any) => ({
            id: item?.form?.id,
            name: item?.form?.name,
            selected: false,
            expanded: false,
          })),
        }));
        const formattedData3 = res3.data?.data?.map((item: any) => ({
          id: item?.id,
          category: item?.category,
          name: item?.name || "",
          selected: "no",
          expanded: false,
          forms: item?.phaseForms?.map((item: any) => ({
            id: item?.form?.id,
            name: item?.form?.name,
            selected: false,
            expanded: false,
          })),
        }));
        const dataArray = [
          {
            id: "visit",
            name: "Visits",
            selected: "no",
            expanded: false,
            formattedData: formattedData1,
          },
          {
            id: "repeating",
            name: "Repeating Data",
            selected: "no",
            expanded: false,
            formattedData: formattedData2,
          },
          {
            id: "survey",
            name: "Surveys",
            selected: "no",
            expanded: false,
            formattedData: formattedData3,
          },
        ];
        const data = {
          id: "entire_study",
          name: "Entire Study",
          selected: "no",
          expanded: false,
          data: dataArray,
        };

        setChecked(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        errorToastMessage(err as Error);
      }
    };
    fetchPhaseData();
  }, [studyId]);

  const handleExpand = (key: string, type: string) => {
    const updatedChecked = {
      ...checked,
      expanded: key === "entire_study" ? !checked.expanded : checked.expanded,
      data: checked.data.map((category: any) => {
        if (category.id === type) {
          if (key === type) {
            return {
              ...category,
              expanded: !category.expanded,
            };
          } else {
            const updatedData = category.formattedData.map((item: any) => {
              if (item.id === key) {
                return {
                  ...item,
                  expanded: !item.expanded,
                };
              }
              return item;
            });
            return {
              ...category,
              formattedData: updatedData,
            };
          }
        }
        return category;
      }),
    };

    setChecked(updatedChecked);
  };

  const handleChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    console.log(id, type);

    let updatedChecked;

    if (type === "entire_study") {
      const updatedData = checked?.data?.map((category: any) => ({
        ...category,
        selected: event.target.checked ? "yes" : "no",
        formattedData: category?.formattedData?.map((phase: any) => ({
          ...phase,
          selected: event.target.checked ? "yes" : "no",
          forms: phase?.forms?.map((form: any) => ({
            ...form,
            selected: event.target.checked,
          })),
        })),
      }));
      updatedChecked = {
        ...checked,
        selected: event.target.checked ? "yes" : "no",
        data: updatedData,
      };
    } else {
      const updatedData = checked?.data?.map((category: any) => {
        let updatedFormattedData;
        let categorySelected = category.selected;
        console.log(category);

        if (type === category.id) {
          updatedFormattedData = category?.formattedData?.map((phase: any) => ({
            ...phase,
            selected: event.target.checked ? "yes" : "no",
            forms: phase?.forms?.map((form: any) => ({
              ...form,
              selected: event.target.checked,
            })),
          }));
          categorySelected = event.target.checked ? "yes" : "no";
        } else if (type === "phases") {
          updatedFormattedData = category?.formattedData?.map((phase: any) => {
            if (phase.id === id) {
              const updatedForms = phase?.forms?.map((form: any) => ({
                ...form,
                selected: event.target.checked,
              }));
              return {
                ...phase,
                selected: event.target.checked ? "yes" : "no",
                forms: updatedForms,
              };
            }
            return phase;
          });
        } else if (type === "forms") {
          updatedFormattedData = category?.formattedData?.map((phase: any) => {
            const updatedForms = phase?.forms?.map((form: any) => {
              if (form.id === id) {
                return {
                  ...form,
                  selected: event.target.checked,
                };
              }
              return form;
            });
            const allSelected =
              updatedForms.length > 0 &&
              updatedForms.every((form: any) => form.selected);
            const anySelected =
              updatedForms.length > 0 &&
              updatedForms.some((form: any) => form.selected);
            const phaseSelected = allSelected
              ? "yes"
              : anySelected
              ? "partial"
              : "no";
            return {
              ...phase,
              selected: phaseSelected,
              forms: updatedForms,
            };
          });
        }

        if (updatedFormattedData) {
          const allPhasesSelected =
            updatedFormattedData.length > 0 &&
            updatedFormattedData.every(
              (phase: any) => phase.selected === "yes"
            );
          const anyPhasesSelected =
            updatedFormattedData.length > 0 &&
            updatedFormattedData.some(
              (phase: any) =>
                phase.selected === "yes" || phase.selected === "partial"
            );
          categorySelected = allPhasesSelected
            ? "yes"
            : anyPhasesSelected
            ? "partial"
            : "no";
        }

        return updatedFormattedData
          ? {
              ...category,
              selected: categorySelected,
              formattedData: updatedFormattedData,
            }
          : category;
      });

      const allCategoriesSelected =
        updatedData.length > 0 &&
        updatedData.every((category: any) => category.selected === "yes");
      const anyCategoriesSelected =
        updatedData.length > 0 &&
        updatedData.some(
          (category: any) =>
            category.selected === "yes" || category.selected === "partial"
        );

      updatedChecked = {
        ...checked,
        selected: allCategoriesSelected
          ? "yes"
          : anyCategoriesSelected
          ? "partial"
          : "no",
        data: updatedData,
      };
    }

    setChecked(updatedChecked);
  };

  console.log(checked);

  const SubChildren = ({ data }: any) => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", ml: 13 }}>
        {data?.map((item: any, index: number) => (
          <Box key={item.id} sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              label={item?.name}
              control={
                <Checkbox
                  checked={item?.selected}
                  indeterminate={item?.selected === "partial"}
                  onChange={(e) => handleChange(item?.id, e, "forms")}
                />
              }
            />
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Modal open={showModal} onClose={closeModal}>
      <Box sx={{ ...ModalBaseStyles, minHeight: "25vh" }}>
        <ModalHeader
          title={"Data Export All Participants"}
          onCloseClick={closeModal}
        />
        {!loading ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={() => handleExpand(checked.id, checked.id)}>
                {checked.expanded ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
              <FormControlLabel
                label={checked.name}
                control={
                  <Checkbox
                    checked={checked.selected === "yes"}
                    indeterminate={checked.selected === "partial"}
                    onChange={(e) =>
                      handleChange(checked.id, e, "entire_study")
                    }
                  />
                }
              />
            </Box>
            {checked.expanded && (
              <>
                {checked?.data.map((category: any) => (
                  <Box key={category.id}>
                    <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
                      <IconButton
                        onClick={() => handleExpand(category.id, category.id)}
                      >
                        {category.expanded ? <ExpandMore /> : <ChevronRight />}
                      </IconButton>
                      <FormControlLabel
                        label={category.name}
                        control={
                          <Checkbox
                            checked={category.selected === "yes"}
                            indeterminate={category.selected === "partial"}
                            onChange={(e) =>
                              handleChange(category.id, e, category.id)
                            }
                          />
                        }
                      />
                    </Box>
                    {category?.expanded && (
                      <>
                        {category?.formattedData.map((item: any) => (
                          <Box key={item?.id}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                ml: 6,
                              }}
                            >
                              <IconButton
                                onClick={() =>
                                  handleExpand(item.id, category.id)
                                }
                              >
                                {item?.expanded ? (
                                  <ExpandMore />
                                ) : (
                                  <ChevronRight />
                                )}
                              </IconButton>
                              <FormControlLabel
                                label={item?.name}
                                control={
                                  <Checkbox
                                    checked={item?.selected === "yes"}
                                    indeterminate={item?.selected === "partial"}
                                    onChange={(e) =>
                                      handleChange(item?.id, e, "phases")
                                    }
                                  />
                                }
                              />
                            </Box>
                            {item?.expanded && (
                              <SubChildren data={item?.forms} />
                            )}
                          </Box>
                        ))}
                      </>
                    )}
                  </Box>
                ))}
              </>
            )}

            <Box sx={{ ...ModalActionButtonStyles, mt: 2 }}>
              {!submitLoader ? (
                <>
                  <Button onClick={closeModal} variant="outlined">
                    Cancel
                  </Button>
                  <Button onClick={submitHandler} variant="contained">
                    Export
                  </Button>
                </>
              ) : (
                <CircularProgress size={25} />
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress size={25} />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ExportAllModal;
