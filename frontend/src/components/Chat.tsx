import serverModel from "@/assets/server-avatar.svg";
import warning from "@/assets/warning.svg";
import user from "@/assets/user.png";
import { useRef, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// Chakra UI Components
import { Input } from "@/components/Input";
import { FiSend } from "react-icons/fi";
import {
    Avatar,
    HStack,
    IconButton,
    Skeleton,
    SkeletonCircle,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { Instructions } from "@/components/LayoutInstruction";
import clsxm from "@/lib/clsxm";
import { Textarea } from "./TextArea";
import useNewsDetectMutation from "@/app/(home)/hooks/useNewsDetectMutation";

export interface ChatProps {}

export interface ChatSchema {
    title: string;
    content: string;
}

export const Chat = ({ ...props }: ChatProps) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    //#region  //*=========== Form ===========
    const methods = useForm<ChatSchema>({
        mode: "onTouched",
    });
    const { handleSubmit, setValue, reset } = methods;
    //#endregion //*======== Form ===========

    const overflowRef = useRef<HTMLDivElement>(null);
    const parentRef = useAutoAnimate({});

    const { mutateAsync } = useNewsDetectMutation();

    const updateScroll = () => {
        overflowRef.current?.scrollTo({
            top: overflowRef.current.scrollHeight,
            behavior: "smooth",
        });
    };

    // Automatically scroll to the bottom whenever `messages` changes
    useEffect(() => {
        updateScroll();
    }, [messages]);

    const handleAsk = async ({ title, content }: ChatSchema) => {
        setIsLoading(true);

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                emitter: "user",
                message: `Title: ${title}\n\nContent: \n${content}`,
            },
        ]);

        reset();

        await mutateAsync({ title, content })
            .then((response) => {
                const predictData = response.data.data;

                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        emitter: "servermodel",
                        message: `${
                            response.data.message
                        }, this the result:\n\n${predictData.true_percentage.toFixed(
                            3
                        )}% True,\n ${predictData.false_percentage.toFixed(
                            3
                        )}% False`,
                    },
                ]);

                setIsLoading(false);
            })
            .catch((error) => {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        emitter: "servermodel",
                        message: `Error: ${
                            error.response?.data.error[0] || "An error occurred"
                        }`,
                    },
                ]);
            });

        setIsLoading(false);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Stack
            width="full"
            height="full"
            className="h-full max-h-screen w-full"
        >
            <Stack
                className={clsxm(
                    "min-h-[70vh] h-[70vh]",
                    messages.length === 0 && "flex items-center justify-center"
                )}
                maxWidth="768px"
                width="full"
                marginX="auto"
                height="80%"
                overflow="auto"
                ref={overflowRef}
            >
                <Stack
                    spacing={2}
                    padding={2}
                    ref={parentRef as React.RefObject<HTMLDivElement>}
                    height="full"
                >
                    {messages.length > 0 ? (
                        messages.map(({ emitter, message }, key) => {
                            const getAvatar = () => {
                                switch (emitter) {
                                    case "servermodel":
                                        return serverModel;
                                    case "error":
                                        return warning;
                                    default:
                                        return user;
                                }
                            };

                            const getMessage = () => {
                                if (message && typeof message === "string") {
                                    return message.startsWith("\n\n")
                                        ? message.slice(2)
                                        : message;
                                }
                                return "";
                            };

                            if (isLoading) {
                                return (
                                    <section className="mt-20" key={key}>
                                        <HStack gap="5">
                                            <SkeletonCircle size="12" />
                                            <Stack flex="1">
                                                <Skeleton height="5" />
                                                <Skeleton
                                                    height="5"
                                                    width="80%"
                                                />
                                            </Stack>
                                        </HStack>
                                    </section>
                                );
                            }

                            return (
                                <Stack
                                    key={key}
                                    direction="row"
                                    padding={4}
                                    rounded={8}
                                    backgroundColor={
                                        emitter === "servermodel"
                                            ? "transparent"
                                            : "blackAlpha.300"
                                    }
                                    spacing={4}
                                >
                                    <Avatar name={emitter} src={getAvatar()} />
                                    <Text
                                        whiteSpace="pre-wrap"
                                        marginTop=".75em !important"
                                        overflow="hidden"
                                    >
                                        {mounted ? (
                                            <ReactMarkdown>
                                                {getMessage()}
                                            </ReactMarkdown>
                                        ) : (
                                            <>{getMessage()}</>
                                        )}
                                    </Text>
                                </Stack>
                            );
                        })
                    ) : (
                        <section className="pt-[28rem] md:pt-0">
                            <Instructions
                                onClick={({ title, content }) => {
                                    setValue("title", title),
                                        setValue("content", content);
                                }}
                            />
                        </section>
                    )}
                </Stack>
            </Stack>
            <Stack
                className="min-h-[30vh] h-[30vh]"
                height="20%"
                padding={4}
                backgroundColor="blackAlpha.400"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
            >
                <Stack maxWidth="768px" className="w-full overflow-scroll px-5">
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleAsk)}>
                            <Input
                                label="News Title"
                                autoFocus
                                variant="filled"
                                {...methods.register("title")}
                            />
                            <Textarea
                                label="News Content"
                                autoFocus
                                variant="filled"
                                {...methods.register("content")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        if (!isLoading) {
                                            handleSubmit(handleAsk)();
                                        }
                                    }
                                }}
                            />
                            <IconButton
                                aria-label="send_button"
                                icon={!isLoading ? <FiSend /> : <Spinner />}
                                backgroundColor="whiteAlpha.400"
                                onClick={handleSubmit(handleAsk)}
                                className="w-full"
                            />
                        </form>
                        <Text textAlign="center" fontSize="sm" opacity={0.5}>
                            Final Project - Rekayasa Sistem Berbasis Pengetahuan
                        </Text>
                    </FormProvider>
                </Stack>
            </Stack>
        </Stack>
    );
};
