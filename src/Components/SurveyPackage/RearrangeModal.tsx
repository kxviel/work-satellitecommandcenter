import React, { useState } from "react";
import { AxiosResponse } from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { errorToastMessage, toastMessage } from "../../utils/toast";
import http from "../../utils/http";
import {
  ModalActionButtonStyles,
  ModalBaseStyles,
  ModalHeader,
} from "../Common/styles/modal";

type Props = {
  closeModal: Function;
  items: any[];
  studyId: any;
  refreshPage: any;
  type: string;
  packageId: string;
};

const typeLabelMap: any = {
  rearrangePhases: "Rearrange phases",
  rearrangeForms: "Rearrange Forms",
};

const RearrangeModal: React.FC<Props> = ({
  closeModal,
  items,
  studyId,
  refreshPage,
  type,
  packageId,
}) => {
  const closeHandler = () => {
    closeModal();
  };
  return (
    <Modal open={true} onClose={closeHandler}>
      <Box
        sx={{
          ...ModalBaseStyles,
          minHeight: "10vh",
        }}
      >
        <ModalHeader
          title={typeLabelMap[type] || ""}
          onCloseClick={closeHandler}
        />
        <DndProvider backend={HTML5Backend}>
          <RearrangeContainer
            type={type}
            items={items}
            closeModal={closeModal}
            studyId={studyId}
            refreshPage={refreshPage}
            packageId={packageId}
          />
        </DndProvider>
      </Box>
    </Modal>
  );
};

const RearrangeItem: React.FC<any> = ({ item, index, handleDrop }) => {
  const [, dragRef] = useDrag(() => {
    return {
      type: "card",
      item: {
        type: "card",
        sort: true,
        origin: index,
      },
    };
  }, [index]);

  const [, drop] = useDrop({
    accept: "card",
    drop: (dropItem: any) => {
      if (dropItem.sort) {
        handleDrop(dropItem, index);
      }
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  return (
    <div ref={drop}>
      <div className="rearrange-section" ref={dragRef}>
        <Menu />
        <Typography
          ml={2}
          fontWeight={"medium"}
          sx={{ textTransform: "capitalize" }}
        >
          {item?.name}
        </Typography>
      </div>
    </div>
  );
};
const RearrangeContainer: React.FC<Props> = React.memo(
  ({ items, closeModal, studyId, refreshPage, type, packageId }) => {
    const [sortedItems, setSortedItems] = useState<any[]>(items);
    const [submitLoader, setSubmitLoader] = useState(false);

    const submitHandler = async () => {
      try {
        setSubmitLoader(true);
        const shuffleObj: any = {};
        sortedItems.forEach((step: any, index: number) => {
          shuffleObj[step.id] = index + 1;
        });
        let body: any;
        let url = `/study/${studyId}/survey-package`;
        if (type === "rearrangeForms") {
          url += `/${packageId}/package_link`;
          body = { ...shuffleObj };
        } else {
          body = {
            items: { ...shuffleObj },
          };
        }
        const res: AxiosResponse = await http.patch(`${url}/order`, body);
        toastMessage("success", res.data.message);
        closeModal();
        refreshPage();
      } catch (err) {
        setSubmitLoader(false);
        errorToastMessage(err as Error);
      }
    };

    const handleDrop = (
      item: { type: string; origin: number },
      index?: number | boolean
    ) => {
      if (typeof index === "number") {
        const selectedItem = { ...sortedItems[item.origin] };
        const changedSections = sortedItems.filter(
          (_: any, i: number) => i !== item.origin
        );
        const prevItems = changedSections.slice(0, index);
        const nextItems = changedSections.slice(index, changedSections.length);
        const modifiedArr = [...prevItems, selectedItem, ...nextItems];
        setSortedItems(modifiedArr);
      }
    };

    const closeHandler = () => {
      closeModal();
    };

    return (
      <>
        {sortedItems.map((item, index) => {
          return (
            <RearrangeItem
              key={item.id}
              item={item}
              index={index}
              handleDrop={handleDrop}
            />
          );
        })}
        <Box sx={ModalActionButtonStyles}>
          {!submitLoader ? (
            <>
              <Button onClick={closeHandler} variant="outlined">
                Cancel
              </Button>
              <Button variant="contained" onClick={submitHandler}>
                Save
              </Button>
            </>
          ) : (
            <CircularProgress size={25} />
          )}
        </Box>
      </>
    );
  }
);

export default RearrangeModal;
