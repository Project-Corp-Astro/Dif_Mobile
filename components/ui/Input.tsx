import { Input as TamaguiInput, styled, XStack, YStack, Text } from 'tamagui';

export const Input = styled(TamaguiInput, {
  borderWidth: 1,
  borderColor: '$borderColor',
  backgroundColor: '$backgroundHover',
  color: '$color',
  borderRadius: '$3',
  padding: '$3',
  outlineWidth: 0,
  
  variants: {
    size: {
      small: {
        height: '$3',
        fontSize: '$2',
        padding: '$2',
      },
      medium: {
        height: '$4',
        fontSize: '$3',
        padding: '$3',
      },
      large: {
        height: '$5',
        fontSize: '$4',
        padding: '$3',
      },
    },
    variant: {
      default: {
        borderColor: '$borderColor',
        backgroundColor: '$backgroundHover',
      },
      outline: {
        borderColor: '$borderColor',
        backgroundColor: 'transparent',
      },
      filled: {
        borderColor: 'transparent',
        backgroundColor: '$backgroundHover',
      },
    },
    state: {
      error: {
        borderColor: '$red10',
      },
      success: {
        borderColor: '$green10',
      },
      disabled: {
        opacity: 0.5,
      },
    },
  } as const,
  
  defaultVariants: {
    size: 'medium',
    variant: 'default',
  },
});

type FormFieldProps = {
  label?: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
};

export const FormField = ({ label, error, helper, children }: FormFieldProps) => {
  return (
    <YStack space="$1.5" marginBottom="$3">
      {label && (
        <Text fontSize="$3" fontWeight="$6" color="$color">
          {label}
        </Text>
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

export default Input;
