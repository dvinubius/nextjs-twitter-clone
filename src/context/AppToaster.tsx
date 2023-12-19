import { Toaster } from "react-hot-toast";

const AppToaster = () => {
  return ( 
    <Toaster 
      toastOptions={{
        success: {
          className: "border border-blue-500",
          style: {backgroundColor: "#eff6ff", color: "#1e40af"},
          duration: 2000
        },
        error: {
          className: "border border-red-500",
          style: {backgroundColor: "#fef2f2", color: "#e53e3e"},
          duration: 5000
        },
      }}
    />
   );
}
 
export default AppToaster;