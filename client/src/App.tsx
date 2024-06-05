import { useState, useEffect, FormEvent } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import Messages from "./components/Messages";
import { baseUrl, wsUrl } from "./constants/urls";
import "./App.css";
import { IMessagesData } from "./models/messagesData";

const queryClient = new QueryClient();

const fetchMessages = async () => {
  const response = await fetch(`${baseUrl}/messages`);
  return response.json();
};

const App = () => {
  const [newMessage, setNewMessage] = useState("");
  const { data, refetch } = useQuery<IMessagesData>("messages", fetchMessages);

  useEffect(() => {
    const ws = new WebSocket(`${wsUrl}/ws`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "ADD") {
        refetch();
      } else if (data.type === "DELETE") {
        refetch();
        alert(`deleted ${data.message}`);
      }
    };

    return () => ws.close();
  }, [refetch]);

  const createMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch(`${baseUrl}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage }),
    });

    setNewMessage("");
  };

  return (
    <div className="container">
      <div>
        <h1>Messages</h1>
        <Messages data={data as IMessagesData} />
        <form onSubmit={(e) => createMessage(e)}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
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
