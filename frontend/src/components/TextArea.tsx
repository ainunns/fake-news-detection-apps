import {
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Textarea as DefaultTextarea,
    TextareaProps as DefaultTextareaProps,
    InputGroup,
    InputLeftElement,
    InputRightElement,
} from "@chakra-ui/react";
import { forwardRef, ReactNode, useRef, useEffect } from "react";
import { useFormContext, FieldValues } from "react-hook-form"; // Import useFormContext

export interface TextareaProps extends DefaultTextareaProps {
    helperText?: string;
    errorMessage?: string;
    label?: string;
    inputLeftAddon?: ReactNode;
    inputRightAddon?: ReactNode;
    required?: boolean;
    name: string; // Ensure this is required for register
    validation?: object; // Optional: Allow custom validation rules for the field
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            errorMessage,
            label,
            helperText,
            inputLeftAddon,
            inputRightAddon,
            required,
            name, // Get the name from props (this is needed for useFormContext)
            validation, // Custom validation rules for the field
            ...props
        },
        ref
    ) => {
        const textareaRef = useRef<HTMLTextAreaElement>(null);

        // Auto-resize the textarea when content changes
        useEffect(() => {
            const resizeTextarea = () => {
                if (textareaRef.current) {
                    // Reset the height to 'auto' to shrink it back before setting the new height
                    textareaRef.current.style.height = "auto";
                    // Set the height to scrollHeight to fit the content
                    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                }
            };

            resizeTextarea(); // Initial resize when component mounts

            // Optional: Add an event listener to resize the textarea dynamically as user types
            const textareaEl = textareaRef.current;
            if (textareaEl) {
                textareaEl.addEventListener("input", resizeTextarea);
            }

            // Clean up the event listener on unmount
            return () => {
                if (textareaEl) {
                    textareaEl.removeEventListener("input", resizeTextarea);
                }
            };
        }, []);

        // Access the form context (register, formState, etc.)
        const {
            register,
            formState: { errors },
        } = useFormContext<FieldValues>();

        // Determine the error message from form state
        const error = errors[name];

        return (
            <FormControl
                isInvalid={Boolean(errorMessage || error)} // Check for errors
                isRequired={required} // If field is required, add validation
            >
                <FormLabel>{label}</FormLabel>
                <InputGroup alignItems="center">
                    {!!inputLeftAddon && (
                        <InputLeftElement>{inputLeftAddon}</InputLeftElement>
                    )}
                    <DefaultTextarea
                        {...register(name, validation)} // Register textarea input with react-hook-form
                        {...props} // Spread other props passed to the component
                        ref={(el) => {
                            // @ts-ignore !IGNORED
                            textareaRef.current = el; // Set the ref to the textarea
                            if (typeof ref === "function") {
                                ref(el); // If ref is a function, call it
                            } else if (ref) {
                                // If ref is a mutable object, set the current property
                                (
                                    ref as React.MutableRefObject<HTMLTextAreaElement | null>
                                ).current = el;
                            }
                        }}
                        style={{
                            resize: "vertical",
                            overflow: "hidden",
                        }} // Disable manual resizing and hide scrollbar
                    />
                    {!!inputRightAddon && (
                        <InputRightElement>{inputRightAddon}</InputRightElement>
                    )}
                </InputGroup>
                {!errorMessage && !error ? (
                    <FormHelperText>{helperText}</FormHelperText> // Display helper text if no error
                ) : (
                    <FormErrorMessage>{errorMessage}</FormErrorMessage> // Display error message if validation fails
                )}
            </FormControl>
        );
    }
);

Textarea.displayName = "Textarea"; // Set display name for the component in dev tools
