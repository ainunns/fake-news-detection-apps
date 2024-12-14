import { ChatSchema } from "@/components/Chat";
import api from "@/lib/api";
import { ApiError, ApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";

type NewsDetectResponse = {
    prediction: boolean;
    true_percentage: number;
    false_percentage: number;
};

export default function useNewsDetectMutation() {
    const { mutateAsync, data, isPending, isSuccess, error } = useMutation<
        AxiosResponse<ApiResponse<NewsDetectResponse>>,
        AxiosError<ApiError>,
        ChatSchema
    >({
        mutationFn: async (data: ChatSchema) => {
            return await api.post("/detect", data);
        },
        onSuccess: () => {
            toast.success("News detected successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data.error[0] || "An error occurred");
            return error;
        },
    });

    return { mutateAsync, data, isPending, isSuccess, error };
}
