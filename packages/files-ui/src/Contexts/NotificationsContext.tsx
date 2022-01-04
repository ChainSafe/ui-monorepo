import  React, { ReactNode, useCallback, useState } from "react"
import { Notification } from "../Components/Elements/Notifications/NotificationsDropdown"

type NotificationsContextProps = {
  children: ReactNode | ReactNode[]
}

interface INotificationsContext {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => void
  removeNotification: (id: string) => void
}

const NotificationsContext = React.createContext<INotificationsContext | undefined>(
  undefined
)

const NotificationsProvider = ({ children }: NotificationsContextProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    setNotifications([...notifications, {
      id: (notifications.length + 1).toString(),
      ...notification
    }])
  }, [notifications])

  const removeNotification = useCallback((id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }, [notifications])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

const useNotifications = () => {
  const context = React.useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

export { NotificationsProvider, useNotifications }
