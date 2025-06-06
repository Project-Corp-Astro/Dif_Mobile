import React from 'react';
import { Card, styled, GetProps } from 'tamagui';

export type ActionCardProps = GetProps<typeof ActionCard> & {
  onPress?: () => void;
};

export const ActionCard = styled(Card, {
  name: 'ActionCard',
  backgroundColor: '$background',
  borderRadius: '$4',
  overflow: 'hidden',
  elevate: true,
  pressStyle: {
    scale: 0.98,
    opacity: 0.9,
  },
  animation: 'quick',
  variants: {
    size: {
      small: {
        padding: '$2',
      },
      medium: {
        padding: '$3',
      },
      large: {
        padding: '$4',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export default ActionCard;
