import {
  onGetChatMessages,
  onGetDomainChatRooms,
} from "@/actions/conversation";
import { setChatRoom } from "@/redux/features/chatRoomSlice";
import { setChats } from "@/redux/features/chatsSlice";
import { setLoading } from "@/redux/features/loadingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  ConversationSearchProps,
  ConversationSearchSchema,
} from "@/schemas/conversation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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

export const useChatTime = (createdAt: Date, roomId: string) => {};
