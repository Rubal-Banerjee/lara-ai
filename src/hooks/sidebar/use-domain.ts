import { AddDomainSchema } from "@/schemas/settings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadClient } from "@uploadcare/upload-client";
import { usePathname, useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { useToast } from "../use-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect, useState } from "react";
import { setLoading } from "@/redux/features/loadingSlice";
import { onIntegrateDomain } from "@/actions/settings";

const upload = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
});

export const useDomain = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    resolver: zodResolver(AddDomainSchema),
  });

  const pathname = usePathname();
  const { toast } = useToast();
  const loading = useAppSelector((store) => store.loadingReducer);
  const dispatch = useAppDispatch();
  const [isDomain, setIsDomain] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    setIsDomain(pathname.split("/").pop());
  }, [pathname]);

  const onAddDomain = handleSubmit(async (values: FieldValues) => {
    dispatch(setLoading(true));
    const uploaded = await upload.uploadFile(values.image[0]);
    const domain = await onIntegrateDomain(values.domain, uploaded.uuid);

    if (domain) {
      reset();
      dispatch(setLoading(false));
      toast({
        title: domain.status == 200 ? "Success" : "Error",
        description: domain.message,
      });
      router.refresh();
    }
  });

  return {
    register,
    onAddDomain,
    errors,
    loading,
    isDomain,
  };
};
