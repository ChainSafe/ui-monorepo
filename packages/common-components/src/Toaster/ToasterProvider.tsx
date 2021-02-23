import React, { ReactNode } from "react"
import Toaster from "./Toaster"
import ToastContainer from "./ToastContainer"
import { Placement, ToastProvider } from "react-toast-notifications"

export interface IToasterProviderProps {
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
  children: ReactNode | ReactNode[];
  placement?: Placement;
}

export const ToasterProvider: React.FC<IToasterProviderProps> = ({
  autoDismiss,
  autoDismissTimeout,
  children,
  placement = "top-right"
}: IToasterProviderProps) => {
  return (
    <ToastProvider
      autoDismiss={autoDismiss}
      autoDismissTimeout={autoDismissTimeout || 5000}
      components={{ Toast: Toaster, ToastContainer: ToastContainer }}
      placement={placement}
    >
      {children}
    </ToastProvider>
  )
}
