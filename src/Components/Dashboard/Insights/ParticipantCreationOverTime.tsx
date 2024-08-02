import { MoreVert } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { NoDataContainer } from "../../Common/styles/table";
import { ResponsiveLine } from "@nivo/line";
import { useAppSelector } from "../../../Redux/hooks";
import { DateTime } from "luxon";

const CustomTooltip = ({ value, label }: any) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        p: 1,
        height: "40px",
        minWidth: "150px",
        backgroundColor: "#FFF",
        borderRadius: "6px",
        border: 1,
        borderColor: "primary.main",
      }}
    >
      <Typography variant="body1" color={"#355962"} fontWeight={550}>
        Month : {label} ,
      </Typography>
      <Typography variant="body1" color={"#355962"} fontWeight={550}>
        Count : {value}
      </Typography>
    </Box>
  );
};

const ParticipantCreationOverTime = ({ data, handleOptionsClick }: any) => {
  const { primaryColor, textColor, secondaryTextColor } = useAppSelector(
    (state) => state.study
  );

  return (
    <Box
      sx={{
        boxShadow: "0px 1px 3px 0px #0000001A",
        p: 2,
        minHeight: "170px",
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontSize={24} fontWeight="700" color="text.primary">
          {data?.title}
        </Typography>
        <Box>
          <IconButton onClick={(e) => handleOptionsClick(e, data)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          maxHeight: "460px",
        }}
      >
        {data?.data?.[0]?.data?.length === 0 ? (
          <NoDataContainer>
            <Typography variant="body1" color="gray">
              No data
            </Typography>
          </NoDataContainer>
        ) : (
          <Box sx={{ height: "450px" }}>
            <ResponsiveLine
              data={data?.data || []}
              curve="monotoneX"
              margin={{ top: 40, right: 70, bottom: 100, left: 70 }}
              xScale={{
                format: "%Y-%m-%d",
                precision: "minute",

                type: "time",
                useUTC: false,
              }}
              yScale={{
                type: "linear",
                min: 0,
                max: data?.yMax,
              }}
              enableGridY={true}
              layers={[
                "grid",
                "markers",
                "axes",
                "lines",
                "points",
                "mesh",
                "legends",
              ]}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                format: "%B %Y",
                tickValues:
                  data?.data?.[0]?.data?.length > 12
                    ? "every 3 months"
                    : "every 1 month",
                legend: "Months",
                legendOffset: 90,
                tickRotation: -45,
                legendPosition: "middle",
              }}
              axisLeft={{
                tickSize: 1,
                tickPadding: 15,
                tickRotation: 0,
                legend: "Number of Participants",
                legendOffset: -60,
                legendPosition: "middle",
              }}
              enableGridX={true}
              colors={[primaryColor || "#327091"]}
              lineWidth={3}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fontSize: 14,
                      fontWeight: 500,
                      fill: textColor || "#355962",
                    },
                  },
                  legend: {
                    text: {
                      fill: secondaryTextColor || "#9CA3AF",
                      fontWeight: 500,
                      fontSize: 14,
                    },
                  },
                },
              }}
              pointSize={10}
              pointColor="#FFF"
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              enableTouchCrosshair={true}
              isInteractive={true}
              useMesh={true}
              tooltip={(value: any) => {
                const date = value?.point?.data?.x;
                let label = DateTime.fromJSDate(date).toFormat("LL/yyyy");

                return (
                  <CustomTooltip value={value?.point?.data?.y} label={label} />
                );
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ParticipantCreationOverTime;
