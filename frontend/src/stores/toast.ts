import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 } from 'uuid';

type Message = {
  text: string;
  type: 'success' | 'error';
};

type MessageInternal = Message & {
  uuid: string;
};

interface ToastStore {
  messages: MessageInternal[];
  remove: (uuid: string) => void;
  add: (msg: Message, uuid: string) => void;
  enqueueMessage: (msg: Message) => void;
}

const useToastStore = create<ToastStore>()(
  persist(
    (set, get) => ({
      messages: [],
      enqueueMessage: (msg: Message) => {
        const uuid = v4();
        get().add(msg, uuid);
        setTimeout(() => {
          get().remove(uuid);
        }, 3000);
      },
      add: (msg: Message, uuid: string) =>
        set((state) => {
          if (state.messages.find((msg) => msg.text === msg.text)) {
            return state;
          } else {
            const newMsg: MessageInternal = { ...msg, uuid };
            return { messages: [...state.messages, newMsg] };
          }
        }),
      remove: (uuid: string) =>
        set((state) => {
          return {
            messages: state.messages.filter((message) => message.uuid !== uuid)
          };
        })
    }),
    {
      name: 'toast'
    }
  )
);

export default useToastStore;
