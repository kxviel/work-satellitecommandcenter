import axios from "axios";
import { toast } from "react-toastify";
import { TypeOptions } from "react-toastify/dist/types";

export const extractErrorMessage = (error: Error) => {
  let message = "Something went wrong";
  if (axios.isAxiosError(error)) {
    if (error?.response) {
      let resMessage = error?.response?.data?.message;
      if (Array.isArray(resMessage)) {
        message = "";
        for (let i = 0; i < resMessage.length; i++) {
          const mes = resMessage[i];
          if (typeof mes === "object" && !Array.isArray(mes) && mes !== null) {
            const values = Object.values(mes);
            for (let j = 0; j < values.length; j++) {
              const val = values[j];
              if (Array.isArray(val)) {
                message += val.join(",");
              } else {
                message +=
                  (val as string) + (j !== values.length - 1 ? "," : "");
              }
            }
          } else {
            message += mes + (i !== resMessage.length - 1 ? "," : "");
          }
        }
      } else {
        message = resMessage;
      }
    } else {
      message = "Something went wrong";
    }
  } else if (error.message && typeof error.message === "string") {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }
  return message;
};

export const errorToastMessage = (error: Error, darkMode?: boolean) => {
  console.log(error);
  const message = extractErrorMessage(error);

  toast.error(message, {
    pauseOnHover: true,
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000,
    theme: "colored",
  });
};

export const toastMessage = (
  type: TypeOptions,
  message: string,
  darkMode?: boolean
) => {
  toast(message, {
    autoClose: 5000,
    position: toast.POSITION.TOP_CENTER,
    pauseOnHover: true,
    type: type,
    theme: "colored",
  });
};
