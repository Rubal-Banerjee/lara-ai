"use client";

import { useSignUp } from "@clerk/nextjs";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  UserRegistrationProps,
  UserRegistrationSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setLoading } from "@/redux/features/loadingSlice";
import { onCompleteUserRegistration } from "@/actions/auth";
import { setAuthStep } from "@/redux/features/authStepSlice";

export const useSignUpForm = () => {
  const { toast } = useToast();
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();
  const authStep = useAppSelector((store) => store.authReducer);
  const dispatch = useAppDispatch();
  const methods = useForm<UserRegistrationProps>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      type: "owner",
    },
    mode: "onChange",
  });

  const onGenerateOtp = async (email: string, password: string) => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: email,
        password: password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      dispatch(setAuthStep(authStep + 1));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.errors[0].longMessage,
      });
    }
  };

  const onHandleSubmit = methods.handleSubmit(
    async (values: UserRegistrationProps) => {
      if (!isLoaded) return;

      try {
        dispatch(setLoading(true));
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: values.otp,
        });

        if (completeSignUp.status !== "complete") {
          return { message: "Something went wrong!" };
        }

        if (completeSignUp.status === "complete") {
          if (!signUp.createdUserId) return;

          const registered = await onCompleteUserRegistration(
            values.fullName,
            signUp.createdUserId,
            values.type
          );

          if (registered?.status === 200 && registered.user) {
            await setActive({
              session: completeSignUp.createdSessionId,
            });

            dispatch(setLoading(false));
            router.push("/dashboard");
          }

          if (registered?.status === 400) {
            toast({
              title: "Error",
              description: "Something went wrong!",
            });
          }
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.errors[0].longMessage,
        });
      }
    }
  );

  return {
    methods,
    onHandleSubmit,
    onGenerateOtp,
  };
};
