import { Button } from '@nextui-org/react';
import { LogIn } from 'lucide-react';
import React from 'react';

const LoginButton = () => {
  return (
    <Button
      color="warning"
      endContent={<LogIn />}
    >
      登录
    </Button>
  );
};

export default LoginButton;
