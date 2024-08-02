import { FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { handleBasicsChange } from "../../../Redux/reducers/questionSlice";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";

type Props = {
  question: any;
};
export const AdvancedTab = ({ question }: Props) => {
  const dispatch = useAppDispatch();

  const isPreview = useAppSelector(({ question }) => !question.editable);

  const onChange = (
    key: string,
    value: string | boolean,
    isProp?: boolean,
    convertToNum?: boolean
  ) => {
    if (!isPreview)
      dispatch(
        handleBasicsChange({
          key,
          value,
          isProp,
          convertToNum,
        })
      );
  };

  return (
    <Stack gap={2} py={1}>
      {["text", "number", "slider", "date"].includes(question.type) && (
        <Stack gap={1}>
          <FormControlLabel
            disabled={isPreview}
            control={
              <Switch
                checked={question.isEncrypted}
                onChange={(e) => onChange("isEncrypted", e.target.checked)}
              />
            }
            label={
              <Typography variant="subtitle1" fontWeight="medium">
                Encrypt Response
              </Typography>
            }
          />
        </Stack>
      )}

      {![
        "statement",
        "summary",
        "randomize",
        "eligibility",
        "repeated_measure",
      ].includes(question.type) && (
        <Stack gap={1}>
          <FormControlLabel
            disabled={isPreview}
            control={
              <Switch
                checked={question.excludeExport}
                onChange={(e) => onChange("excludeExport", e.target.checked)}
              />
            }
            label={
              <Typography variant="subtitle1" fontWeight="medium">
                Exclude in Export
              </Typography>
            }
          />
        </Stack>
      )}
    </Stack>
  );
};
