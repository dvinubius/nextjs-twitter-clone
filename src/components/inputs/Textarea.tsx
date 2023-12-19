'use client';

import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface TextareaProps {
  label: string;
  id: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  id,
  register,
  required,
  errors,
  disabled,
  maxLength,
  placeholder
}) => {
  return ( 
    <div>
      <label 
        htmlFor={id} 
        className="
          block 
          text-sm 
          font-medium 
          leading-6 
          text-gray-900
        "
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          maxLength={maxLength}
          id={id}
          disabled={disabled}
          placeholder={placeholder}
          {...register(id, { required })}
          className={`
            resize-none
            form-input
            block 
            w-full 
            rounded-md 
            border-0 
            py-1.5 
            text-gray-900 
            shadow-sm 
            ring-1 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-2 
            focus:ring-inset 
            focus:ring-sky-600 
            sm:text-sm 
            sm:leading-6 
            ${errors[id] ? 'focus:ring-rose-500' : ''}
            ${disabled ? 'opacity-50 cursor-default': ''}
          `}
        />
      </div>
    </div>
   );
}
 
export default Textarea;