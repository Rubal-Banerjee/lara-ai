"use client";

import { useChatTime } from "@/hooks/conversation/use-conversation";
import React from "react";

type Props = {
  title: string;
  description?: string;
  createdAt: Date;
  id: string;
  onChat(): void;
  seen: boolean;
};

const ChatCard = ({
  title,
  description,
  createdAt,
  id,
  onChat,
  seen,
}: Props) => {
  const {} = useChatTime(createdAt, id);
  return <div>ChatCard</div>;
};

export default ChatCard;
