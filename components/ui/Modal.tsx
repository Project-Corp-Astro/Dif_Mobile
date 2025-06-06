import React, { ReactNode } from 'react';
import { Modal as RNModal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { YStack, XStack, styled, Text, Button, useTheme } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  contentPadding?: boolean;
}

export const Modal = ({
  visible,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationType = 'fade',
  contentPadding = true,
}: ModalProps) => {
  const theme = useTheme();
  
  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={closeOnBackdropPress ? onClose : undefined}>
        <YStack flex={1} justifyContent="center" alignItems="center" style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <YStack
              backgroundColor="$background"
              borderRadius="$4"
              width="90%"
              maxWidth={500}
              overflow="hidden"
              elevation={5}
              shadowColor="$color"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.25}
              shadowRadius={3.84}
            >
              {title && (
                <XStack
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                  borderBottomWidth={1}
                  borderBottomColor="$borderColor"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text fontSize="$5" fontWeight="$6" color="$color">
                    {title}
                  </Text>
                  
                  {showCloseButton && (
                    <Button
                      size="$2"
                      circular
                      unstyled
                      onPress={onClose}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                      <Ionicons
                        name="close"
                        size={24}
                        color={theme.color?.get() || '#000'}
                      />
                    </Button>
                  )}
                </XStack>
              )}
              
              <YStack padding={contentPadding ? '$4' : 0}>
                {children}
              </YStack>
            </YStack>
          </TouchableWithoutFeedback>
        </YStack>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export const ModalHeader = styled(XStack, {
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderBottomWidth: 1,
  borderBottomColor: '$borderColor',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const ModalBody = styled(YStack, {
  padding: '$4',
});

export const ModalFooter = styled(XStack, {
  padding: '$4',
  borderTopWidth: 1,
  borderTopColor: '$borderColor',
  justifyContent: 'flex-end',
  gap: '$2',
});

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Modal;
