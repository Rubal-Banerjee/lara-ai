"use client";

import { Loader } from "@/components/loader";
import { useSignInForm } from "@/hooks/sign-in/use-sign-in";
import { useAppSelector } from "@/redux/hook";
import React from "react";
import { FormProvider } from "react-hook-form";

type Props = {
  children: React.ReactNode;
};

const SignInFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit } = useSignInForm();
  const loading = useAppSelector((store) => store.loadingReducer);

  return (
    <FormProvider {...methods}>
      <form onSubmit={onHandleSubmit} className="h-full">
        <div className="flex flex-col justify-between gap-3 h-full">
          <Loader loading={loading}>{children}</Loader>
        </div>
      </form>
    </FormProvider>
  );
};

export default SignInFormProvider;
