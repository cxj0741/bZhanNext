// components/MyTextarea.tsx

import React from "react";
import { Textarea } from "@nextui-org/react";

interface MyTextareaProps {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function MyTextarea({ content, setContent }: MyTextareaProps) {
  return (
    <Textarea
      isRequired
      label="内容"
      labelPlacement="outside"
      placeholder="写一篇话题吧"
      variant="underlined"
      className="max-w-xs"
      value={content} // 从父组件传入的受控状态
      onValueChange={setContent} // 从父组件传入的状态更新函数
    />
  );
}
