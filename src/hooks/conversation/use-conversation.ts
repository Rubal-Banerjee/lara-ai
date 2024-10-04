import {
  onGetChatMessages,
  onGetDomainChatRooms,
  onOwnerSendMessage,
  onRealTimeChat,
  onViewUnReadMessages,
} from "@/actions/conversation";
import { pusherClient } from "@/lib/utils";
import { setChatRoom } from "@/redux/features/chatRoomSlice";
import { setChats } from "@/redux/features/chatsSlice";
import { setLoading } from "@/redux/features/loadingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  ChatBotMessageSchema,
  ConversationSearchProps,
  ConversationSearchSchema,
} from "@/schemas/conversation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export const useConversation = () => {
  const { register, watch } = useForm({
    resolver: zodResolver(ConversationSearchSchema),
    mode: "onChange",
  });
  const loading = useAppSelector((store) => store.loadingReducer);
  const dispatch = useAppDispatch();
  const [chatRooms, setChatRooms] = useState<
    {
      chatRoom: {
        id: string;
        createdAt: Date;
        message: {
          message: string;
          createdAt: Date;
          seen: boolean;
        }[];
      }[];
      email: string | null;
    }[]
  >([]);

  useEffect(() => {
    const search = watch(async (value) => {
      dispatch(setLoading(true));
      try {
        const rooms = await onGetDomainChatRooms(value.domain!);
        if (rooms) {
          dispatch(setLoading(false));
          setChatRooms(rooms.customer);
        }
      } catch (error) {
        console.log(error);
      }
    });
    return () => search.unsubscribe();
  }, [watch]);

  const onGetActiveChatMessages = async (id: string) => {
    try {
      dispatch(setLoading(true));
      const messages = await onGetChatMessages(id);

      if (messages) {
        dispatch(setChatRoom(id));
        dispatch(setLoading(false));
        dispatch(setChats(messages[0].message));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    chatRooms,
    loading,
    onGetActiveChatMessages,
  };
};

export const useChatTime = (createdAt: Date, roomId: string) => {
  const chatRoom = useAppSelector((store) => store.chatRoomReducer);
  const [messageSentAt, setMessageSentAt] = useState<string>();
  const [urgent, setUrgent] = useState<boolean>(false);

  const onSetMessageReceivedDate = () => {
    const current = new Date();
    const currentDate = current.getDate();
    const sent = new Date(createdAt);
    const sentDate = sent.getDate();
    const difference = currentDate - sentDate;

    if (difference <= 0) {
      setMessageSentAt(
        `${sent.getHours}:${sent.getMinutes} ${
          sent.getHours() < 12 ? "AM" : "PM"
        }`
      );
      if (current.getHours() - sent.getHours() < 2) {
        setUrgent(true);
      }
    } else {
      setMessageSentAt(`${sentDate} ${sent.getMonth()}`);
    }
  };

  const onSeenChat = async () => {
    if (chatRoom == roomId && urgent) {
      await onViewUnReadMessages(roomId);
      setUrgent(false);
    }
  };

  useEffect(() => {
    onSeenChat();
  }, [chatRoom]);

  useEffect(() => {
    onSetMessageReceivedDate();
  }, []);

  return {
    messageSentAt,
    urgent,
    onSeenChat,
  };
};

export const useChatWindow = () => {
  const chats = useAppSelector((store) => store.chatsReducer);
  const chatRoom = useAppSelector((store) => store.chatRoomReducer);
  const loading = useAppSelector((store) => store.loadingReducer);
  const dispatch = useAppDispatch();
  const messageWindowRef = useRef<HTMLDivElement | null>(null);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(ChatBotMessageSchema),
    mode: "onChange",
  });
  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    onScrollToBottom();
  }, [chats, messageWindowRef]);

  // WIP: Setup Pusher

  // useEffect(() => {
  //   if (chatRoom) {
  //     pusherClient.subscribe(chatRoom)
  //     pusherClient.bind("realtime-mode", (data: any) => {
  //       dispatch(setChats([...chats, data.chat]))
  //     })

  //     return () => {
  //       pusherClient.unbind("realtime-mode")
  //       pusherClient.unsubscribe(chatRoom)
  //     }
  //   }
  // }, [chatRoom])

  const onHandleSentMessage = handleSubmit(async (values) => {
    try {
      const message = await onOwnerSendMessage(
        chatRoom!,
        values.content,
        "assistant"
      );

      if (message) {
        dispatch(setChats([...chats, message.message[0]]));
        // WIP: Uncomment this when pusher is set
        // await onRealTimeChat(
        //   chatRoom!,
        //   message.message[0].message,
        //   message.message[0].id,
        //   "assistant"
        // )
      }
    } catch (error) {
      console.log(error);
    }
  });

  return {
    messageWindowRef,
    register,
    onHandleSentMessage,
    chats,
    loading,
    chatRoom,
  };
};
