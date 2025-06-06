import React from 'react';
import { Form as TamaguiForm, YStack, styled, Label, Text } from 'tamagui';
import { FormField } from './Input';

// Create a styled Form component
export const Form = styled(TamaguiForm, {
  width: '100%',
});

type CustomFormItemProps = {
  label?: string;
  name: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
};

// Create a custom form item component that doesn't rely on Form.Field
export const FormItem = ({ label, name, error, helper, children }: CustomFormItemProps) => {
  return (
    <YStack space="$1.5" marginBottom="$3">
      {label && (
        <Label htmlFor={name} fontSize="$3" fontWeight="$6" color="$color">
          {label}
        </Label>
      )}
      
      {children}
      
      {error ? (
        <Text fontSize="$2" color="$red10">
          {error}
        </Text>
      ) : helper ? (
        <Text fontSize="$2" color="$gray10">
          {helper}
        </Text>
      ) : null}
    </YStack>
  );
};

type FormSectionProps = {
  title?: string;
  children: React.ReactNode;
};

export const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <YStack space="$4" marginBottom="$6">
      {title && (
        <YStack
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          paddingBottom="$2"
          marginBottom="$2"
        >
          <Text fontSize="$5" fontWeight="$6" color="$color">
            {title}
          </Text>
        </YStack>
      )}
      {children}
    </YStack>
  );
};

export default Form;
