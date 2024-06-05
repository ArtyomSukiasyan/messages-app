import { useState, useEffect, FormEvent } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import { baseUrl, wsUrl } from "./constants/urls";

const queryClient = new QueryClient();

const fetchMessages = async () => {
  const response = await fetch(`${baseUrl}/messages`);
  return response.json();
};

const App = () => {
  const { data, refetch } = useQuery("messages", fetchMessages);
  const [newMessage, setNewMessage] = useState("");

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
    <div>
      <h1>Messages</h1>
      <ul>
        {data?.messages.map((message: string, idx: number) => (
          <li key={idx}>{message}</li>
        ))}
      </ul>
      <form onSubmit={(e) => createMessage(e)}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

const WrappedApp = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default WrappedApp;
