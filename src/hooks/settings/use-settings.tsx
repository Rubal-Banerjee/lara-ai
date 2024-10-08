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
import {
  onChatBotImageUpdate,
  onCreateFilterQuestions,
  onCreateHelpDeskQuestion,
  onDeleteUserDomain,
  onGetAllFilterQuestions,
  onGetAllHelpDeskQuestions,
  onUpdateDomain,
  onUpdatePassword,
  onUpdateWelcomeMessage,
} from "@/actions/settings";
import {
  DomainSettingsProps,
  DomainSettingsSchema,
  FilterQuestionsProps,
  FilterQuestionsSchema,
  HelpDeskQuestionsProps,
  HelpDeskQuestionsSchema,
} from "@/schemas/settings.schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

    if (values.image[0]) {
      const uploaded = await upload.uploadFile(values.image[0]);
      const image = await onChatBotImageUpdate(id, uploaded.uuid);
      if (image) {
        toast({
          title: image.status == 200 ? "Success" : "Error",
          description: image.message,
        });
        dispatch(setLoading(false));
      }
    }

    if (values.welcomeMessage) {
      const message = await onUpdateWelcomeMessage(id, values.welcomeMessage);
      if (message) {
        toast({
          title: "Success",
          description: message.message,
        });
      }
    }

    reset();
    router.refresh();
    dispatch(setLoading(false));
  });

  const onDeleteDomain = async () => {
    setDeleting(true);
    const deleted = await onDeleteUserDomain(id);

    if (deleted) {
      toast({
        title: "Success",
        description: deleted.message,
      });
      dispatch(setLoading(false));
      router.refresh();
    }
  };

  return {
    register,
    onUpdateSettings,
    onDeleteDomain,
    errors,
    loading,
    deleting,
  };
};

export const useHelpDesk = (id: string) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HelpDeskQuestionsProps>({
    resolver: zodResolver(HelpDeskQuestionsSchema),
  });

  const { toast } = useToast();
  const loading = useAppSelector((store) => store.loadingReducer);
  const dispatch = useAppDispatch();
  const [isQuestions, setIsQuestions] = useState<
    { id: string; question: string; answer: string }[]
  >([]);
  const onSubmitQuestion = handleSubmit(async (values) => {
    dispatch(setLoading(true));
    const question = await onCreateHelpDeskQuestion(
      id,
      values.question,
      values.answer
    );
    if (question) {
      setIsQuestions(question.questions!);
      toast({
        title: question.status == 200 ? "Success" : "Error",
        description: question.message,
      });
      dispatch(setLoading(false));
      reset();
    }
  });

  const onGetQuestions = async () => {
    dispatch(setLoading(true));
    const questions = await onGetAllHelpDeskQuestions(id);
    if (questions) {
      setIsQuestions(questions.questions);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    onGetQuestions();
  }, []);

  return {
    register,
    onSubmitQuestion,
    errors,
    isQuestions,
    loading,
  };
};

export const useFilterQuestions = (id: string) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FilterQuestionsProps>({
    resolver: zodResolver(FilterQuestionsSchema),
  });

  const { toast } = useToast();
  const loading = useAppSelector((store) => store.loadingReducer);
  const dispatch = useAppDispatch();
  const [isQuestions, setIsQuestions] = useState<
    { id: string; question: string }[]
  >([]);

  const onAddFilterQuestions = handleSubmit(async (values) => {
    dispatch(setLoading(true));
    const questions = await onCreateFilterQuestions(id, values.question);

    if (questions) {
      setIsQuestions(questions.questions!);
      toast({
        title: questions.status == 200 ? "Success" : "Error",
        description: questions.message,
      });
      reset();
      dispatch(setLoading(false));
    }
  });

  const onGetQuestions = async () => {
    dispatch(setLoading(true));
    const questions = await onGetAllFilterQuestions(id);

    if (questions) {
      setIsQuestions(questions.questions);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    onGetQuestions();
  }, []);

  return {
    register,
    errors,
    onAddFilterQuestions,
    loading,
    isQuestions,
  };
};
