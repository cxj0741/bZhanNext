"use client"
import { ThemeSwitcher } from "./cpmponents/ThemeSwitcher";
import {  Spacer } from "@nextui-org/react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import LoginButton from "./cpmponents/MyButton/LoginButton"
import MyModal from "./cpmponents/Modal/MyModal"
import { useEffect, useState } from "react";
import { Topic } from "../../src/util/type";
import TicketTopics from "./cpmponents/TicketTopics"

export default function Home() {

  const [topics, setTopics] = useState<Topic[]>([]); // 提升到父容器中的状态

  useEffect(()=>{
    const fetchData = async()=>
      {
        const result= await fetch(process.env.API_ADDRESS+"/topic",{
          cache: "no-cache",
          method: "GET"
        });
        const data= await result.json();
        setTopics(data.topics as Topic[])
      }
      fetchData();
  },[])
  
  return (
    <div>
      <header className="w-full h-14 ">
        <div className="fixed top-4 right-8 flex justify-between items-center ">

          <MyModal topics={topics} setTopics={setTopics} />

          <Spacer x={4} />

          <SignedOut>
            <SignInButton>
             <LoginButton/>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          <Spacer x={4} />

          <ThemeSwitcher />
        </div>
      </header>

      <div className="flex items-center justify-center m-4">
        <main className="flex flex-col items-center justify-center  w-full  overflow-hidden">
          {topics&&topics.map((topic)=>{
            return <TicketTopics {...topic} key={topic.id}/>
          })}
        </main>
      </div>

    </div>
  );
}
