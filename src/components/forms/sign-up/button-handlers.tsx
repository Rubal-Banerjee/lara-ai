"use client";

import { Button } from "@/components/ui/button";
import { useSignUpForm } from "@/hooks/sign-up/use-sign-up";
import { setAuthStep } from "@/redux/features/authStepSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import Link from "next/link";
import React from "react";
import { useFormContext } from "react-hook-form";

type Props = {};

const ButtonHandler = (props: Props) => {
  const authStep = useAppSelector((store) => store.authReducer);
  const dispatch = useAppDispatch();
  const { formState, getFieldState, getValues } = useFormContext();
  const { onGenerateOtp } = useSignUpForm();
  const { isDirty: isName } = getFieldState("fullname", formState);
  const { isDirty: isEmail } = getFieldState("email", formState);
  const { isDirty: isPassword } = getFieldState("password", formState);

  if (authStep === 3) {
    return (
      <div className="w-full flex flex-col gap-3 items-center">
        <Button type="submit" className="w-full">
          Create an account
        </Button>
        <p>
          Already have an account?{" "}
          <Link href={"/auth/sign-in"} className="font-bold">
            Sign In
          </Link>
        </p>
      </div>
    );
  }

  if (authStep === 2) {
    return (
      <div className="w-full flex flex-col gap-3 items-center">
        <Button
          type="submit"
          className="w-full"
          {...(isName &&
            isEmail &&
            isPassword && {
              onClick: () =>
                onGenerateOtp(getValues("email"), getValues("password")),
            })}
        >
          Continue
        </Button>
        <p>
          Already have an account?{" "}
          <Link href={"/auth/sign-in"} className="font-bold">
            Sign In
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <Button
        type="submit"
        className="w-full"
        onClick={() => dispatch(setAuthStep(authStep + 1))}
      >
        Continue
      </Button>
      <p>
        Already have an account?{" "}
        <Link href={"/auth/sign-in"} className="font-bold">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default ButtonHandler;
