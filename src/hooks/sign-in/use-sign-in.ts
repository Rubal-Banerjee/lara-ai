import { useToast } from "../use-toast";
import { setLoading } from "@/redux/features/loadingSlice";
import { useAppDispatch } from "@/redux/hook";
import { UserLoginProps, UserLoginSchema } from "@/schemas/auth.schema";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const useSignInForm = () => {
  const { isLoaded, setActive, signIn } = useSignIn();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const methods = useForm<UserLoginProps>({
    resolver: zodResolver(UserLoginSchema),
    mode: "onChange",
  });
  const onHandleSubmit = methods.handleSubmit(
    async (values: UserLoginProps) => {
      if (!isLoaded) return;

      try {
        dispatch(setLoading(true));
        const authenticated = await signIn.create({
          identifier: values.email,
          password: values.password,
        });

        if (authenticated.status === "complete") {
          await setActive({ session: authenticated.createdSessionId });
          toast({
            title: "Success",
            description: "Welcome back!",
          });
          dispatch(setLoading(false));
          router.push("/dashboard");
        }
      } catch (error: any) {
        if (error.errors[0].code === "form_password_incorrect")
          toast({
            title: "Error",
            description: "email/password is incorrect try again",
          });
      }
    }
  );

  return {
    methods,
    onHandleSubmit,
  };
};
