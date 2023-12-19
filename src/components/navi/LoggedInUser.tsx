
import { Tooltip } from 'flowbite-react';
import type { ReactNode } from 'react';

export function LoggedInUser({children, content}: {children: React.ReactNode | React.ReactNode[], content: ReactNode}) {
  return (
    <Tooltip content={content} style="light" placement='top'>
      {children}
    </Tooltip>        
  );
}