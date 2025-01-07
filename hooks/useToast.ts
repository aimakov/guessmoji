import { useToast as CHUseToast, position } from "@chakra-ui/react";

export type ToastConfig = {
  title?: string;
  description?: string | React.ReactNode;
  status?: "error" | "info" | "warning" | "success" | "loading" | undefined;
  duration?: number;
  isClosable?: boolean;
};

const useToast = () => {
  const toast = CHUseToast();

  const errorToast = (config?: ToastConfig) => {
    const id = "error-toast";
    const defaultConfig = {
      title: "Oops, something went wrong.",
      description: "Please try again later or contact us if the problem persists.",
      status: "error",
      duration: 4000,
      isClosable: true,
      zIndex: 100,
      position: "top",
    };

    if (!toast.isActive(id)) {
      // @ts-ignore
      toast({
        ...defaultConfig,
        ...config,
      });
    }
  };

  const successToast = (config?: ToastConfig, id = "success-toast") => {
    const defaultConfig = {
      title: "Success  ✅",
      description: "Your details have been updated",
      status: "success",
      duration: 1500,
      isClosable: true,
      zIndex: 100,
      position: "top",
    };

    if (!toast.isActive(id)) {
      // @ts-ignore
      toast({
        ...defaultConfig,
        ...config,
      });
    }
  };

  const warningToast = (config?: ToastConfig, id = "success-toast") => {
    const defaultConfig = {
      title: "Warning",
      description: "This action is not allowed",
      status: "warning",
      duration: 1500,
      isClosable: true,
      zIndex: 100,
      position: "top",
    };

    if (!toast.isActive(id)) {
      // @ts-ignore
      toast({
        ...defaultConfig,
        ...config,
      });
    }
  };

  return { errorToast, successToast, warningToast };
};

export default useToast;
