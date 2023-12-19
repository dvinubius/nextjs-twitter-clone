import Image from "next/image";
import { useState, type ButtonHTMLAttributes, type DetailedHTMLProps } from "react";

type BannerProps = {
  image?: string | null;
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Banner({
  image,
  className = ""
}: BannerProps) {
  const [isLoading, setIsLoading] = useState(true);

  const onLoadingComplete = () => {
    setIsLoading(false);
  }

  const imageVisCss = isLoading ? "opacity-0 absolute" : "opacity-100";

  return (
    <div className={`max-h-[12rem] flex items-center content-center overflow-hidden ${className}`}>
      {isLoading && 
        <div className="animate-pulse w-full">
          <div className="flex items-center justify-center h-48 bg-gray-300 rounded w-full dark:bg-gray-700">
              <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
              </svg>
          </div>
        </div>
      }
      <Image className={`rounded-t-lg w-full ${imageVisCss}`} alt="profile banner" src={image ?? ""} width={360} height={120} onLoadingComplete={onLoadingComplete}/>
    </div>
  );
}