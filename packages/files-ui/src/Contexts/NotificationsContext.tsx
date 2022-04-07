import  React, { ReactNode, useCallback, useState } from "react"
import { Notification } from "../Components/Elements/Notifications/NotificationsDropdown"
import { v4 as uuidv4 } from "uuid"

type NotificationsContextProps = {
  children: ReactNode | ReactNode[]
}

interface INotificationsContext {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => string
  removeNotification: (id: string) => void
}

const NotificationsContext = React.createContext<INotificationsContext | undefined>(undefined)

const NotificationsProvider = ({ children }: NotificationsContextProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = uuidv4()
    setNotifications([...notifications, {
      id,
      ...notification
    }])
    return id
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
