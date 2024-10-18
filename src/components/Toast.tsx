import React from "react";
import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

export const showNotification = (
  type: NotificationType,
  description: string
) => {
  notification[type]({
    message: `Notification ${type}`,
    description,
    placement: "topRight",
    duration: 3,
    showProgress: true,
  });
};
