import type { ReactNode } from 'react';

export const CenterWrapper = ({ children } : {children?: ReactNode | ReactNode[]}) => {
  return <div className="max-w-xl m-auto">
    <>
      {children}
    </>
  </div>
};