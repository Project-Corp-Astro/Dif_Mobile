import { Card as TamaguiCard, styled, YStack } from 'tamagui';

export const Card = styled(TamaguiCard, {
  backgroundColor: '$background',
  borderRadius: '$4',
  padding: '$4',
  
  variants: {
    variant: {
      elevated: {
        shadowColor: '$color',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
      },
      outlined: {
        borderWidth: 1,
        borderColor: '$borderColor',
      },
      flat: {
        shadowOpacity: 0,
        borderWidth: 0,
      },
    },
    size: {
      small: {
        padding: '$2',
      },
      medium: {
        padding: '$4',
      },
      large: {
        padding: '$5',
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'elevated',
    size: 'medium',
  },
});

export const ActionCard = styled(Card, {
  pressStyle: {
    opacity: 0.9,
    scale: 0.98,
  },
});

export const CardHeader = styled(YStack, {
  marginBottom: '$2',
});

export const CardFooter = styled(YStack, {
  marginTop: '$3',
  borderTopWidth: 1,
  borderTopColor: '$borderColor',
  paddingTop: '$3',
});

export default Card;
