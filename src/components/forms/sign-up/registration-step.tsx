"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import TypeSelectionForm from "./type-selection-form";
import dynamic, { DynamicOptionsLoadingProps } from "next/dynamic";
import { Spinner } from "@/components/spinner";

const DetailForm = dynamic(() => import("./account-details-form"), {
  ssr: false,
  loading: (loadingProps: DynamicOptionsLoadingProps) => <Spinner />,
});

const OTPForm = dynamic(() => import("./otp-form"), {
  ssr: false,
  loading: (loadingProps: DynamicOptionsLoadingProps) => <Spinner />,
});

const RegistrationFormStep = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const authStep = useAppSelector((store) => store.authReducer);
  const dispatch = useAppDispatch();
  const [onOTP, setOnOTP] = useState<string>("");
  const [onUserType, setOnUserType] = useState<"owner" | "student">("owner");

  setValue("otp", onOTP);

  switch (authStep) {
    case 1:
      return (
        <TypeSelectionForm
          register={register}
          userType={onUserType}
          setUserType={setOnUserType}
        />
      );
    case 2:
      return <DetailForm register={register} errors={errors} />;
    case 3:
      return <OTPForm onOTP={onOTP} setOTP={setOnOTP} />;
  }
};

export default RegistrationFormStep;
