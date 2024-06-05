import { FormEvent, useState } from "react";
import { baseUrl } from "../constants/urls";

export default function MessageForm() {
  const [message, setMessage] = useState("");

  const createMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch(`${baseUrl}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
    });

    setMessage("");
  };

  return (
    <form onSubmit={(e) => createMessage(e)}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
