import { Button as TamaguiButton, styled } from 'tamagui';

export const Button = styled(TamaguiButton, {
  borderRadius: '$3',
  overflow: 'hidden',
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$brand',
        color: 'white',
        pressStyle: {
          backgroundColor: '$brand',
          opacity: 0.9,
        },
      },
      secondary: {
        backgroundColor: '$accent',
        color: 'white',
        pressStyle: {
          backgroundColor: '$accent',
          opacity: 0.9,
        },
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
        color: '$brand',
        pressStyle: {
          backgroundColor: '$background',
          opacity: 0.9,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        color: '$brand',
        pressStyle: {
          backgroundColor: '$background',
          opacity: 0.7,
        },
      },
    },
    size: {
      small: {
        height: '$5',
        paddingHorizontal: '$3',
        fontSize: '$2',
      },
      medium: {
        height: '$6',
        paddingHorizontal: '$4',
        fontSize: '$3',
      },
      large: {
        height: '$7',
        paddingHorizontal: '$5',
        fontSize: '$4',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        pointerEvents: 'none',
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
});

export const IconButton = styled(Button, {
  width: '$6',
  height: '$6',
  paddingHorizontal: 0,
  paddingVertical: 0,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$3',
});

export default Button;
