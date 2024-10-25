import React from "react";
import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

export const showNotification = (
  type: NotificationType,
  message: string
) => {
  notification[type]({
    message,
    placement: "topRight",
    duration: 3,
    showProgress: true,

  });
};
