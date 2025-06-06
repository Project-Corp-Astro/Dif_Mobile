import { YStack, styled } from 'tamagui';

export const Container = styled(YStack, {
  flex: 1,
  backgroundColor: '$background',
  padding: '$4',
  
  variants: {
    variant: {
      default: {
        backgroundColor: '$background',
      },
      card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
      },
    },
    padding: {
      none: {
        padding: 0,
      },
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
    variant: 'default',
    padding: 'medium',
  },
});

export const Screen = styled(Container, {
  flex: 1,
});

export const Section = styled(YStack, {
  marginBottom: '$4',
});

export default Container;
