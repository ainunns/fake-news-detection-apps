"use client";

//Components
import { Stack, useMediaQuery } from "@chakra-ui/react";
import { Sidebar } from "@/components/SideBar";
import { Chat } from "@/components/Chat";

export default function HomePage() {
    const [isResponsive] = useMediaQuery("(max-width: 800px)");

    return (
        <Stack
            className="max-h-screen overflow-hidden"
            direction={!isResponsive ? "row" : "column"}
            width="full"
            height="full"
            spacing={0}
        >
            {/* <Sidebar isResponsive={isResponsive} /> */}
            <Chat />
        </Stack>
    );
}
