import { Stack, Heading, Icon, Button, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiAlertTriangle, FiSun, FiZap } from "react-icons/fi";

type prompt = {
    title: string;
    content: string;
};

type Introdution = {
    icon: IconType;
    name: "Examples" | "Capabilities" | "Limitations";
    list: prompt[];
};

export interface IInstructionsProps {
    onClick: ({ title, content }: prompt) => void;
}

export const Instructions = ({ onClick }: IInstructionsProps) => {
    const introdution: Introdution[] = [
        {
            icon: FiSun,
            name: "Examples",
            list: [
                {
                    title: "Biden defeats Trump for White House, says ‘time to heal",
                    content:
                        "WASHINGTON (AP) — Democrat Joe Biden defeated President Donald Trump to become the 46th president of the United States on Saturday and offered himself to the nation as a leader who “seeks not to divide, but to unify” a country gripped by a historic pandemic and a confluence of economic and social turmoil.“I sought this office to restore the soul of America,” Biden said in a prime-time victory speech not far from his Delaware home, “and to make America respected around the world again and to unite us here at home.”Biden crossed the winning threshold of 270 Electoral College votes with a win in Pennsylvania. His victory came after more than three days of uncertainty as election officials sorted through a surge of mail-in votes that delayed processing.Trump refused to concede, threatening further legal action on ballot counting. But Biden used his acceptance speech as an olive branch to those who did not vote for him, telling Trump voters that he understood their disappointment but adding, “Let’s give each other a chance.“It’s time to put away the harsh rhetoric, to lower the temperature, to see each other again, to listen to each other again, to make progress, we must stop treating our opponents as our enemy,” he said. “We are not enemies. We are Americans.",
                },
                {
                    title: "Mexico Passes Controversial Law Cementing Military’s Role in Drug War",
                    content:
                        "Under legislation progressing in Congress, U.S. President Donald Trump would be required to notify lawmakers before establishing a joint U.S.-Russia cybersecurity unit—an idea that has faced bipartisan criticism. If enacted, this measure would add to a series of congressional actions either restricting the president’s authority on Russia-related issues or opposing his efforts to improve ties with Moscow. The requirement, included in the annual Intelligence Authorization Act, mandates the Trump administration to submit a report to Congress outlining the intelligence to be shared with Russia, any counterintelligence risks, and plans to address those risks. The Senate Intelligence Committee approved the provision by a 14-1 vote in July as part of the broader bill overseeing operations by the CIA and other intelligence agencies. While the committee passed the legislation earlier, its details were only recently disclosed due to the classified nature of the operations it governs.",
                },
                {
                    title: "ONE DEMOCRAT WHO REFUSES To Cast Electoral Vote For Crooked Hillary Could End It All For He",
                    content:
                        "Trump is going to win in a landslide, but wouldn t it be a delicious irony to see a male Bernie supporter have the power to keep her from assuming a role she stole from his guy several months ago It s the Electoral College that determines the President, not the popular vote. And the Electoral College is made up of Electors.Usually, the Electoral College is a formality. Electors vote for whomever won their state.This year, there s a hiccup. A Democrat Elector in Washington state says he won t vote for Hillary.Washington state is almost certainly going for Hillary.If this man won t vote for Hillary, he could keep her from getting the 270 electoral votes needed to win the Presidency.Here s what he said:Robert Satiacum is a Bernie fan. He thinks the Democrat primary was rigged. He thinks Hillary cheated. So he won t vote for her.Watch Satiacum letting everyone know he s not joking around:The Seattle Times reported: No, no, no on Hillary. Absolutely not. No way,  said Robert Satiacum, a member of Washington s Puyallup Tribe who had supported Vermont Sen. Bernie Sanders as the Democratic presidential nominee. He had earlier told various media outlets he was wrestling with whether his conscience would allow him to support Clinton and was considering stepping aside for an alternate elector. But on Friday, he sounded firm, even if the election is close.  I hope it comes down to a swing vote and it s me,  he said.  Good. She ain t getting it. Maybe it ll wake this country up. And the Seattle Times says there s another Elector in Washington state who might do the same thing:Bret Chiafalo, a Democratic elector from Everett who is also a Sanders supporter, said he is considering exercising his right to be a  conscientious elector  and vote for the person he believes would be the best president.  I have no specific plans, but I have not ruled out that possibility,  he said. Via: American Lookout",
                },
            ],
        },
        {
            icon: FiZap,
            name: "Capabilities",
            list: [
                {
                    title: "Remembers what user said earlier in the conversation",
                    content:
                        "Remembers what user said earlier in the conversation",
                },
                {
                    title: "Allows user to provide follow-up corrections",
                    content: "Allows user to provide follow-up corrections",
                },
                {
                    title: "Trained to decline inappropriate requests",
                    content: "Trained to decline inappropriate requests",
                },
            ],
        },
        {
            icon: FiAlertTriangle,
            name: "Limitations",
            list: [
                {
                    title: "May occasionally generate incorrect information",
                    content: "May occasionally generate incorrect information",
                },
                {
                    title: "May occasionally produce harmful instructions or biased content",
                    content:
                        "May occasionally produce harmful instructions or biased content",
                },
                {
                    title: "Limited knowledge of world and events after 2021",
                    content: "Limited knowledge of world and events after 2021",
                },
            ],
        },
    ];

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            height="full"
            overflow="auto"
        >
            <Heading size="lg" marginY={8}>
                Fake News Detection
            </Heading>
            <Stack direction={["column", "column", "row"]}>
                {introdution.map(({ icon, list, name }, key) => {
                    const handleClick = ({ title, content }: prompt) => {
                        if (
                            name == "Examples" ||
                            name == "Capabilities" ||
                            name == "Limitations"
                        ) {
                            return () => onClick({ title, content });
                        }
                        return undefined;
                    };

                    return (
                        <Stack key={key} alignItems="center">
                            <Icon as={icon} />
                            <Heading size="sm">{name}</Heading>
                            {list.map((text, key) => (
                                <Button
                                    key={key}
                                    maxWidth={64}
                                    height="fit-content"
                                    padding={4}
                                    onClick={handleClick({
                                        title: text.title,
                                        content: text.content,
                                    })}
                                >
                                    <Text overflow="hidden" whiteSpace="normal">
                                        {text.title}
                                    </Text>
                                </Button>
                            ))}
                        </Stack>
                    );
                })}
            </Stack>
        </Stack>
    );
};
