import React, { useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import { loadQuestionDetails } from "../../Redux/actions/questionAction";

type Props = {
  closeModal: () => void;
};

const RearrangeModal = ({ closeModal }: Props) => {
  const questions = useAppSelector((state) => state.question.questions);

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
          title={"Rearrange Questions"}
          onCloseClick={closeHandler}
        />
        <DndProvider backend={HTML5Backend}>
          <RearrangeContainer items={questions} closeModal={closeModal} />
        </DndProvider>
      </Box>
    </Modal>
  );
};

const RearrangeItem = ({ item, index, handleDrop }: any) => {
  const [, dragRef] = useDrag(
    () => ({
      type: "card",
      item: {
        type: "card",
        sort: true,
        origin: index,
      },
    }),
    [index]
  );

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
          sx={{
            textTransform: "capitalize",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
          title={item?.name}
        >
          {item?.label}
        </Typography>
      </div>
    </div>
  );
};

type RearrangeContainerProps = {
  items: any;
  closeModal: Function;
};

const RearrangeContainer: React.FC<RearrangeContainerProps> = React.memo(
  ({ items, closeModal }) => {
    const dispatch = useAppDispatch();

    const studyId = useAppSelector((state) => state.question.studyId);
    const formId = useAppSelector((state) => state.question.qid);
    const revision = useAppSelector((state) => state.question.revision);

    const [sortedItems, setSortedItems] = useState<any[]>([]);
    const [submitLoader, setSubmitLoader] = useState(false);

    useEffect(() => {
      setSortedItems(
        items
          .slice()
          .sort(
            (a: { position: number }, b: { position: number }) =>
              a.position - b.position
          )
      );
    }, [items]);

    const submitHandler = async () => {
      try {
        setSubmitLoader(true);
        const shuffleObj: any = {};
        sortedItems.forEach((step: any, index: number) => {
          shuffleObj[step.id] = index + 1;
        });

        await http
          .patch(`/study/${studyId}/forms/${formId}/question/rearrange`, {
            revision,
            items: shuffleObj,
          })
          .then(({ data }) => {
            toastMessage("success", data.message);
            dispatch(loadQuestionDetails(studyId, formId));
            closeModal();
          });
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
              <Button variant="outlined" onClick={closeHandler}>
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
