interface IMessageNotificationProps {
  deletedMessage: string;
  newMessage: string;
}

export default function MessageNotifications({
  deletedMessage,
  newMessage,
}: IMessageNotificationProps) {
  return (
    <>
      <MessageNotification message={deletedMessage} type="delete" />
      <MessageNotification message={newMessage} type="add" />
    </>
  );
}

function MessageNotification({
  message,
  type,
}: {
  message: string;
  type: "add" | "delete";
}) {
  const notifications = {
    add: "new message:",
    delete: "deleted message:",
  };

  const notification = notifications[type];

  return (
    <div>
      {message && (
        <p>
          {notification} {message}
        </p>
      )}
    </div>
  );
}
