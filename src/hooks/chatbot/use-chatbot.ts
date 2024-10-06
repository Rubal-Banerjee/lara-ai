import { onGetCurrentChatBot } from "@/actions/bot";
import { postToParent } from "@/lib/utils";
import { setLoading } from "@/redux/features/loadingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  ChatBotMessageProps,
  ChatBotMessageSchema,
} from "@/schemas/conversation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadClient } from "@uploadcare/upload-client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const upload = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
});

export const useChatBot = () => {
  // WIP: Select Realtime with pusher.
  const { register, handleSubmit, reset } = useForm<ChatBotMessageProps>({
    resolver: zodResolver(ChatBotMessageSchema),
  });
  const [currentBot, setCurrentBot] = useState<
    | {
        name: string;
        chatBot: {
          id: string;
          icon: string | null;
          welcomeMessage: string | null;
          background: string | null;
          textColor: string | null;
          helpdesk: boolean;
        } | null;
        helpdesk: {
          id: string;
          question: string;
          answer: string;
          domainId: string | null;
        }[];
      }
    | undefined
  >();
  const messageWindowRef = useRef<HTMLDivElement | null>(null);
  const [botOpened, setBotOpened] = useState<boolean>(false);

  const setOpenChatBot = () => setBotOpened((prev) => !prev);
  const loading = useAppSelector((store) => store.loadingReducer);
  const dispatch = useAppDispatch();
  const [onChats, setOnChats] = useState<
    {
      role: "assistant" | "user";
      content: string;
      link?: string;
    }[]
  >([]);
  const [onAiTyping, setOnAiTyping] = useState<boolean>(false);
  const [currentBotId, setCurrentBotId] = useState<string>();
  const [onRealTime, setOnRealTime] = useState<
    | {
        chatRoom: string;
        mode: boolean;
      }
    | undefined
  >(undefined);

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    onScrollToBottom();
  }, [onChats, messageWindowRef]);

  useEffect(() => {
    postToParent(
      JSON.stringify({
        width: botOpened ? 550 : 80,
        height: botOpened ? 800 : 80,
      })
    );
  }, [botOpened]);

  let limitRequest = 0;

  const onGetDomainChatBot = async (id: string) => {
    dispatch(setLoading(true));
    setCurrentBotId(id);
    const chatbot = await onGetCurrentChatBot(id);
    if (chatbot) {
      setOnChats((prev) => [
        ...prev,
        {
          role: "assistant",
          content: chatbot.chatBot?.welcomeMessage!,
        },
      ]);
      setCurrentBot(chatbot), dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    window.addEventListener("message", (e) => {
      const botId = e.data;
      if (limitRequest < 1 && typeof botId == "string") {
        onGetDomainChatBot(botId);
        limitRequest++;
      }
    });
  }, []);

  const onStartChatting = handleSubmit(async (values) => {
    reset();
    if (values.image.length) {
      const uploaded = await upload.uploadFile(values.image[0]);
      setOnChats((prev: any) => [
        ...prev,
        {
          role: "user",
          content: uploaded.uuid,
        },
      ]);
      setOnAiTyping(true);
      const response = await onAiChatBotAssistant(
        currentBotId!,
        onChats,
        "user",
        uploaded.uuid
      );
    }
  });
};
