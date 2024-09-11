import useToastStore from '@app/stores/toast';
import { FC } from 'react';

const Toast: FC = () => {
  const { messages } = useToastStore();

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.uuid}>{msg.text}</div>
      ))}
    </div>
  );
};

export default Toast;
