import React from 'react';
import { styled, YStack, XStack, ListItem as TamaguiListItem, Text, Separator } from 'tamagui';
// Using a simple chevron icon instead of importing from lucide-icons
import { Ionicons } from '@expo/vector-icons';

export const List = styled(YStack, {
  width: '100%',
  backgroundColor: '$background',
  variants: {
    variant: {
      plain: {
        borderRadius: 0,
      },
      grouped: {
        borderRadius: '$3',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '$borderColor',
      },
    },
    separated: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    variant: 'plain',
    separated: true,
  },
});

export interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  disabled?: boolean;
}

export const ListItem = ({
  title,
  subtitle,
  icon,
  rightElement,
  onPress,
  showChevron = false,
  disabled = false,
}: ListItemProps) => {
  return (
    <TamaguiListItem
      pressTheme
      onPress={onPress}
      disabled={disabled}
      opacity={disabled ? 0.5 : 1}
      paddingVertical="$3"
      paddingHorizontal="$4"
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      hoverTheme
      focusTheme
      pressStyle={{
        backgroundColor: '$backgroundHover',
      }}
    >
      <XStack flex={1} alignItems="center" gap="$3">
        {icon && <XStack>{icon}</XStack>}
        
        <YStack flex={1}>
          <Text color="$color" fontWeight={subtitle ? '$6' : '$4'}>
            {title}
          </Text>
          {subtitle && (
            <Text color="$gray10" fontSize="$2" marginTop="$1">
              {subtitle}
            </Text>
          )}
        </YStack>
        
        {rightElement && <XStack>{rightElement}</XStack>}
        
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color="#999" />
        )}
      </XStack>
    </TamaguiListItem>
  );
};

export const ListHeader = styled(Text, {
  paddingHorizontal: '$4',
  paddingVertical: '$2',
  fontWeight: '$6',
  color: '$gray11',
  fontSize: '$3',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
});

export const ListSeparator = styled(Separator, {
  height: 1,
  backgroundColor: '$borderColor',
});

export const ListFooter = styled(Text, {
  paddingHorizontal: '$4',
  paddingVertical: '$2',
  color: '$gray10',
  fontSize: '$2',
});

export default List;
