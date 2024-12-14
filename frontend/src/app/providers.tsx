"use client";

import {
    QueryClient,
    QueryClientProvider,
    QueryOptions,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/app/theme";

import api from "@/lib/api";

const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
    const { data } = await api.get(`${queryKey?.[0]}`);
    return data;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: defaultQueryFn,
        },
    },
});

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <Toaster position="top-center" />
                {children}
            </ChakraProvider>
        </QueryClientProvider>
    );
}
