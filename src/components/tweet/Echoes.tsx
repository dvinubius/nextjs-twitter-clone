import { VscArrowBoth, VscFold, VscRedo } from "react-icons/vsc";
import { RoundIconHover } from "../shared/RoundIconHover";
import { useState } from "react";
import type { Echo, Tweet } from "~/types/tweet.type";

const NUM_ECHOES_TO_PREVIEW = 2;

export function Echoes({echoes, expand}: {echoes: Tweet["echoes"], expand: boolean}) {

  const [open, setOpen] = useState(false);
  
  function toggleExpandEchoes() {
    setOpen(open => !open);
  }

  const previewEchoes = echoes.slice(0,NUM_ECHOES_TO_PREVIEW);

  const paneClasses = `relative ml-auto ${open ? 'max-h-24 w-[calc(100%-1rem)] min-w-[7.5rem] min-h-[4rem]' : 'h-20 w-[4.5rem]'} 
    flex flex-col gap-1 py-1 px-1.5 
    bg-lightest-blue border border-blue-50 rounded-lg text-xs text-gray-500`;

  const expanderClasses = `absolute -right-2 -top-2 bg-blue-300 rounded-full text-white text-2xl p-1
    hover:cursor-pointer hover:bg-blue-400 transition-colors duration-200 transition-transform transform`;

  return (
    <div className={paneClasses}>
      <div className="text-gray-500 flex gap-1 items-center">
        {!open && <><VscRedo className="text-blue-600"></VscRedo><span> by</span></>}
        {open && <><VscRedo className="text-blue-600"></VscRedo><span>Echoed by</span></>}
      </div>
      {!open && (
        <div>
        {previewEchoes.map((echo) => (
          <div className="text-ellipsis whitespace-nowrap overflow-hidden" key={echo.user.id}>{echo.user.name}</div>
        ))}
      </div> 
      )}
      {open && (
        <div className="w-full px-1">
          {echoes.map((echo: Echo, idx: number) => (
            <span className="mx-1 first:ml-0 text-gray-700" key={echo.user.id}>{`${echo.user.name ?? ''}${idx < echoes.length - 1 ? ',' : ''}`}</span>
          ))}
        </div> 
      )}
      {!open && (echoes.length > 2 ? <div>... +{echoes.length - 2}</div>: <div className="invisible">-</div>)}
      {expand && (
        <RoundIconHover>
          {!open && <VscArrowBoth className={`${expanderClasses} -rotate-45`} onClick={toggleExpandEchoes}/>}
          {open && <VscFold className={`${expanderClasses} rotate-45`} onClick={toggleExpandEchoes}/>}
        </RoundIconHover>
      )}
    </div>
  );
}