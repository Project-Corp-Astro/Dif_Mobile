import React from 'react';
import { Avatar as TamaguiAvatar, styled, YStack, Text, XStack } from 'tamagui';
import { Image } from 'react-native';

export const Avatar = styled(TamaguiAvatar, {
  variants: {
    size: {
      tiny: {
        size: '$3',
      },
      small: {
        size: '$5',
      },
      medium: {
        size: '$7',
      },
      large: {
        size: '$9',
      },
      xlarge: {
        size: '$11',
      },
    },
    circular: {
      true: {
        borderRadius: 1000,
      },
      false: {
        borderRadius: '$3',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
    circular: true,
  },
});

export const AvatarImage = styled(TamaguiAvatar.Image, {
  objectFit: 'cover',
});

export const AvatarFallback = styled(TamaguiAvatar.Fallback, {
  backgroundColor: '$gray5',
  justifyContent: 'center',
  alignItems: 'center',
});

type AvatarWithDetailsProps = {
  source?: { uri: string };
  fallback?: string;
  name?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
};

export const AvatarWithDetails = ({
  source,
  fallback,
  name,
  description,
  size = 'medium',
}: AvatarWithDetailsProps) => {
  const avatarSize = size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium';
  const textSize = size === 'small' ? '$2' : size === 'large' ? '$5' : '$3';
  const descriptionSize = size === 'small' ? '$1' : size === 'large' ? '$3' : '$2';
  
  return (
    <XStack space="$3" alignItems="center">
      <Avatar size={avatarSize}>
        {source ? (
          <AvatarImage source={source} />
        ) : (
          <AvatarFallback>
            <Text color="$color" fontSize={textSize} fontWeight="$6">
              {fallback || (name ? name.charAt(0).toUpperCase() : '?')}
            </Text>
          </AvatarFallback>
        )}
      </Avatar>
      
      {(name || description) && (
        <YStack>
          {name && (
            <Text fontSize={textSize} fontWeight="$6" color="$color">
              {name}
            </Text>
          )}
          {description && (
            <Text fontSize={descriptionSize} color="$gray10">
              {description}
            </Text>
          )}
        </YStack>
      )}
    </XStack>
  );
};

export default Avatar;
