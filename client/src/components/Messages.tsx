import { IMessagesData } from "../models/messagesData";

export default function Messages({ data }: { data: IMessagesData }) {
  return (
    <ul>
      {data?.messages.map((message: string, idx: number) => (
        <li key={idx}>{message}</li>
      ))}
    </ul>
  );
}
