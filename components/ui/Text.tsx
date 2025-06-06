import { Text as TamaguiText, styled } from 'tamagui';

export const Text = styled(TamaguiText, {
  color: '$color',
  variants: {
    variant: {
      heading: {
        fontSize: '$6',
        fontWeight: '$8',
        color: '$color',
      },
      subheading: {
        fontSize: '$5',
        fontWeight: '$6',
        color: '$color',
      },
      body: {
        fontSize: '$4',
        color: '$color',
      },
      caption: {
        fontSize: '$3',
        color: '$gray10',
      },
      error: {
        fontSize: '$3',
        color: '$red10',
      },
      link: {
        fontSize: '$3',
        color: '$blue10',
        fontWeight: '$6',
      },
    },
    size: {
      small: { fontSize: '$2' },
      medium: { fontSize: '$4' },
      large: { fontSize: '$6' },
      xlarge: { fontSize: '$8' },
    },
  } as const,
  defaultVariants: {
    variant: 'body',
    size: 'medium',
  },
});

export const Heading = styled(Text, {
  color: '$color',
  fontWeight: '$8',
  variants: {
    size: {
      small: { fontSize: '$4' },
      medium: { fontSize: '$5' },
      large: { fontSize: '$6' },
      xlarge: { fontSize: '$8' },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export const Subheading = styled(Text, {
  fontSize: '$5',
  fontWeight: '$6',
  color: '$color',
});

export const Caption = styled(Text, {
  fontSize: '$3',
  color: '$gray10',
});

export const ErrorText = styled(Text, {
  color: '$red10',
});

export const LinkText = styled(Text, {
  color: '$blue10',
  fontWeight: '$6',
});
