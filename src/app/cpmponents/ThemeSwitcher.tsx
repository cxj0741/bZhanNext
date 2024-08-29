// app/components/ThemeSwitcher.tsx
"use client";

import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import { SunMoon, Moon} from "lucide-react";
import { Button } from "@nextui-org/react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div>
     <Button isIconOnly color="warning" variant="faded" aria-label="theme" onClick={()=>{
        setTheme(theme==='light'?'dark':'light')
     }}>
     {theme==='light' ?<Moon size={30} /> : <SunMoon size={30} />}
     </Button>
      
    </div>
  )
};