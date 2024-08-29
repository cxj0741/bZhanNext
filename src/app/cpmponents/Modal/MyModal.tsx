
import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Spacer, Chip} from "@nextui-org/react";
import { Send ,Upload} from "lucide-react";
import MyTextarea from "../../cpmponents/Textarea/MyTextarea";
import { CldUploadButton } from "next-cloudinary";
import SimpleButton from "../MyButton/SimpleButton"
import { useAuth, useUser } from "@clerk/nextjs";
import { Topic } from "../../../../src/util/type";

interface MyModalProps {
  topics: Topic[];
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
}

export default function MyModal({ topics, setTopics }: MyModalProps) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [options,setOptions]= useState<string[]>([])
  const [currentOption,setCurrentOption]=useState("")
  const [images,setImages]= useState<string[]>([])

  
  const {userId} = useAuth(); //用户id
  const avatar= useUser().user?.imageUrl; //用户头像

  const [content, setContent] = useState(""); // 在父组件中管理状态

  return (
    <>
      <Button color="success" endContent={<Send/>} onPress={onOpen}>发布</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">发布话题</ModalHeader>
              <ModalBody>
                <MyTextarea content={content} setContent={setContent} />
                <Spacer y={2} />
                <CldUploadButton
                uploadPreset="bhbbmvl2" //未签名的上传允许
                onSuccess={(result) => {
                  
                  if (typeof result?.info !== 'string' && result?.info?.url) {
                    console.log(result.info.url);
                    setImages([...images, result.info.url]);
                }

                }} //指定成功之后的回调
                >
                    {/* 传封装的按钮可能会比较慢，直接写一个普通的按钮即可 */}
                    <SimpleButton text="上传图片" icon={Upload} />
                </CldUploadButton>

                <Spacer y={2}/>

                <div className="flex items-center">
                    <Input
                    label="输入选项"
                    variant="faded"
                    size="sm"
                    value={currentOption}
                    onValueChange={setCurrentOption}
                    />
                    <Spacer x={3}/>
                    <Button color="success" onClick={() => {
                        setOptions([
                           ... options,
                            currentOption
                        ]);
                        setCurrentOption("");
                    }}>
                        添加
                    </Button>
                </div>

                <Spacer y={2}/>

               

                <div className="flex gap-2">
                    {
                        options.map((item,index) => {
                            return (
                                <Chip 
                                key={index}
                                onClose={(e)=> {
                                    setOptions(options.filter(i => i!==item))
                                }}
                                variant="flat"
                                >
                                    {item}
                                </Chip>
                            )
                        })
                    }
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}
                onClick={async ()=>{
                  const result = await fetch(process.env.API_ADDRESS+"/topic",{
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        userId: userId,
                        avatar: avatar,
                        content: content,
                        images: images,
                        options: options
                      })
                    });

                   const data= (await result.json() ) as Topic 

                   setTopics([...topics,data]);
                   setContent("");
                   setOptions([]);
                   setCurrentOption("");
                   setImages([]);
                }}
                >
                  确定
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
