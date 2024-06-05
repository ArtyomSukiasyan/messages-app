import { useState, useEffect } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import Messages from "./components/Messages";
import MessageNotifications from "./components/MessageNotifications";
import MessageForm from "./components/MessageForm";
import { baseUrl, wsUrl } from "./constants/urls";
import { IMessagesData } from "./models/messagesData";
import "./App.css";

const queryClient = new QueryClient();

const fetchMessages = async () => {
  const response = await fetch(`${baseUrl}/messages`);
  return response.json();
};

const App = () => {
  const [newMessage, setNewMessage] = useState("");
  const { data, refetch } = useQuery<IMessagesData>("messages", fetchMessages);
  const [deletedMessage, setDeletedMessage] = useState("");

  useEffect(() => {
    const ws = new WebSocket(`${wsUrl}/ws`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "ADD") {
        refetch();
        setNewMessage(data.message);
      } else if (data.type === "DELETE") {
        refetch();
        setDeletedMessage(data.message);
      }
    };

    return () => ws.close();
  }, [refetch]);

  return (
    <div className="container">
      <div>
        <h1>Messages</h1>
        <Messages data={data as IMessagesData} />
        <MessageNotifications
          newMessage={newMessage}
          deletedMessage={deletedMessage}
        />
        <MessageForm />
      </div>
    </div>
  );
};

const WrappedApp = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default WrappedApp;
