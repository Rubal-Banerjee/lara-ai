import {
  ChangePasswordProps,
  ChangePasswordSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadClient } from "@uploadcare/upload-client";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { useToast } from "../use-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setLoading } from "@/redux/features/loadingSlice";
import { onUpdateDomain, onUpdatePassword } from "@/actions/settings";
import {
  DomainSettingsProps,
  DomainSettingsSchema,
} from "@/schemas/settings.schema";
import { useRouter } from "next/navigation";
import { useState } from "react";

const upload = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
});

export const useThemeMode = () => {
  const { setTheme, theme } = useTheme();

  return {
    setTheme,
    theme,
  };
};

export const useChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordProps>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
  });

  const { toast } = useToast();

  const loading = useAppSelector((store) => store.loadingReducer);

  const dispatch = useAppDispatch();

  const onChangePassword = handleSubmit(async (values) => {
    try {
      dispatch(setLoading(true));
      const updated = await onUpdatePassword(values.password);
      if (updated) {
        reset();
        dispatch(setLoading(false));
        toast({
          title: "Success",
          description: updated.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  return {
    register,
    errors,
    onChangePassword,
    loading,
  };
};

export const useSettings = (id: string) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DomainSettingsProps>({
    resolver: zodResolver(DomainSettingsSchema),
  });
  const router = useRouter();
  const { toast } = useToast();
  const loading = useAppSelector((store) => store.loadingReducer);
  const dispatch = useAppDispatch();
  const [deleting, setDeleting] = useState<boolean>(false);

  const onUpdateSettings = handleSubmit(async (values) => {
    dispatch(setLoading(true));
    if (values.domain) {
      const domain = await onUpdateDomain(id, values.domain);
      if (domain) {
        toast({
          title: "Success",
          description: domain.message,
        });
      }
    }

    if (values.image) {
    }
  });
};
