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
    const [mounted, setMounted] = useState(false); // Track if component is mounted

    //#region  //*=========== Form ===========

    const methods = useForm<ChatSchema>({
        mode: "onTouched",
    });
    const { handleSubmit, setValue } = methods;

    //#endregion //*======== Form ===========

    const overflowRef = useRef<HTMLDivElement>(null);
    const updateScroll = () => {
        overflowRef.current?.scrollTo(0, overflowRef.current.scrollHeight);
    };

    const parentRef = useAutoAnimate({});

    const { mutateAsync, data, isPending, isSuccess, error } =
        useNewsDetectMutation();

    const handleAsk = async ({ title, content }: ChatSchema) => {
        setIsLoading(true); // Start loading when submit
        updateScroll();

        // Immediately update messages with user input and add " OI"
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                emitter: "user",
                message: `Title: ${title}\n\nContent: \n${content}`, // Add OI here
            },
        ]);

        // Reset form after submitting
        setValue("title", "");
        setValue("content", "");

        // Trigger the mutation for further processing
        await mutateAsync({ title, content })
            .then((response) => {
                console.log("Mutation triggered", response);

                const predictData = response.data.data;

                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        emitter: "servermodel",
                        message: `${response.data.message}, this the result:\n\n${predictData.true_percentage}% True,\n ${predictData.false_percentage}% False`,
                    },
                ]);

                setIsLoading(false);
                updateScroll();
                return response;
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
                return error;
            });

        // Wait until isLoading is false
        while (isLoading) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setIsLoading(false);
        updateScroll();
    };

    console.log("Messages", messages);

    // Set mounted to true once component is mounted on client
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
                                    if (message.slice(0, 2) === "\n\n") {
                                        return message.slice(2);
                                    }
                                    return message;
                                }
                                return "";
                            };

                            if (isLoading) {
                                return (
                                    <section className="mt-20">
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
                                        emitter == "servermodel"
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
                <Stack
                    maxWidth="768px"
                    className=" w-full overflow-scroll px-5"
                >
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleAsk)}>
                            <Input
                                label="News Title"
                                autoFocus={true}
                                variant="filled"
                                {...methods.register("title")}
                            />
                            <Textarea
                                label="News Content"
                                autoFocus={true}
                                variant="filled"
                                inputRightAddon={
                                    <IconButton
                                        aria-label="send_button"
                                        icon={
                                            !isLoading ? (
                                                <FiSend />
                                            ) : (
                                                <Spinner />
                                            )
                                        }
                                        backgroundColor="transparent"
                                        onClick={handleSubmit(handleAsk)}
                                    />
                                }
                                {...methods.register("content")}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault(); // Prevent the default behavior of new line creation
                                        if (!isLoading) {
                                            handleSubmit(handleAsk)();
                                        }
                                    }
                                }}
                            />
                            <Text
                                textAlign="center"
                                fontSize="sm"
                                opacity={0.5}
                            >
                                Final Project - Rekayasa Sistem Berbasis
                                Pengetahuan
                            </Text>
                        </form>
                    </FormProvider>
                </Stack>
            </Stack>
        </Stack>
    );
};
