import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { errorToastMessage } from "../../../utils/toast";
import http from "../../../utils/http";
import { useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import {
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { handleBasicsChange } from "../../../Redux/reducers/questionSlice";

type Props = {
  question: any;
};

const RepeatedMeasure = ({ question }: Props) => {
  const { id: studyId } = useParams();
  const dispatch = useAppDispatch();
  const isPreview = useAppSelector(({ question }) => !question.editable);
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchPhaseData = async () => {
      try {
        const res: AxiosResponse = await http.get(
          `/study/${studyId}/study-phase/minimal?category=repeated_data`
        );
        const data = res.data?.data;

        const formattedData = data
          ?.map((item: any) => ({
            id: item?.id,
            name: item?.name || "",
            type: item?.type || "",
          }))
          .filter((item: any) => item.type === "repeated_measure")
          .sort((a: any, b: any) => a.position - b.position);

        setList(formattedData || []);
      } catch (err) {
        errorToastMessage(err as Error);
      }
    };
    fetchPhaseData();
  }, [studyId]);

  const onChange = (key: string, value: string | boolean) => {
    if (!isPreview)
      dispatch(
        handleBasicsChange({
          key,
          value,
          isProp: true,
        })
      );
  };

  return (
    <>
      <Stack gap={1}>
        <Typography variant="subtitle1" fontWeight="medium">
          Repeated Measure
        </Typography>
        <FormControl fullWidth>
          <Select
            fullWidth
            id="repeated_measure"
            value={question.properties.phaseId || ""}
            onChange={(e) => onChange("phaseId", e.target.value)}
          >
            {list.length ? (
              list.map((phase: any) => (
                <MenuItem key={phase.id} value={phase.id}>
                  {phase.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem key={"None"} value={""} disabled>
                No Data available
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
};

export default RepeatedMeasure;
