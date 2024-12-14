import {
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input as DefaultInput,
    InputProps as DefaultInputProps,
    InputGroup,
    InputRightElement,
    InputLeftElement,
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";
import { useFormContext, FieldValues } from "react-hook-form"; // Import useFormContext

export interface InputProps extends DefaultInputProps {
    helperText?: string;
    errorMessage?: string;
    label?: string;
    inputLeftAddon?: ReactNode;
    inputRightAddon?: ReactNode;
    required?: boolean;
    name: string; // Ensure this is required for `register`
    validation?: object; // Optional: Allow custom validation rules for the field
}

export interface InputRef extends HTMLInputElement {}

export const Input = forwardRef<InputRef, InputProps>(
    (
        {
            helperText,
            errorMessage,
            label,
            inputLeftAddon,
            inputRightAddon,
            required,
            name, // Get the `name` from props (this is needed for `useFormContext`)
            validation, // Custom validation rules for the field
            ...props
        },
        ref
    ) => {
        // Access the form context (register, formState, etc.)
        const {
            register,
            formState: { errors },
        } = useFormContext<FieldValues>();

        // Determine the error message from form state
        const error = errors[name];

        return (
            <FormControl
                isInvalid={Boolean(errorMessage || error)}
                isRequired={required}
            >
                <FormLabel>{label}</FormLabel>
                <InputGroup alignItems="center">
                    {!!inputLeftAddon && (
                        <InputLeftElement>{inputLeftAddon}</InputLeftElement>
                    )}
                    <DefaultInput
                        // {...inputProps} // Register input field with react-hook-form
                        {...register(name, validation)} // Register input field with react-hook-form
                        {...props}
                        ref={ref}
                    />
                    {!!inputRightAddon && (
                        <InputRightElement>{inputRightAddon}</InputRightElement>
                    )}
                </InputGroup>
                {!errorMessage && !error ? (
                    <FormHelperText>{helperText}</FormHelperText>
                ) : (
                    <FormErrorMessage>{errorMessage}</FormErrorMessage>
                )}
            </FormControl>
        );
    }
);

Input.displayName = "Input";
