import { useState, useRef, useEffect } from 'react';
import { Platform, FlatList, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Text,
  YStack,
  XStack,
  Spinner,
  Card,
  Button,
  Input,
  useTheme,
  View
} from 'tamagui';

import { fetchChatHistory, sendChatMessage } from '@services/chatService';
import { useUserStore } from '@state/userStore';
import { useHaptics } from '@hooks/useHaptics';
import { useAppTour } from '@hooks/useAppTour'; // Import app tour hook

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const { lightImpact, successNotification, errorNotification } = useHaptics();
  const theme = useTheme();
  
  // App tour integration
  const appTour = useAppTour();
  const inputRef = useRef<any>(null);
  const sendButtonRef = useRef<any>(null);

  // Fetch chat history
  const { data: chatHistory, isLoading } = useQuery<Message[]>({
    queryKey: ['chatHistory', user?.id],
    queryFn: () => fetchChatHistory(user?.id),
  });
  
  // Set initial messages when chat history loads
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setMessages(chatHistory);
    } else if (!isLoading && (!chatHistory || chatHistory.length === 0)) {
      // Add welcome message if no chat history
      setMessages([
        {
          id: 'welcome',
          text: 'Hello! I\'m your Astro Assistant. How can I help you with your astrological questions today?',
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  }, [chatHistory, isLoading]);

  // Define response type for the mutation
  interface ChatResponse {
    text: string;
  }
  
  // Send message mutation
  const { mutate: sendMessage, isPending: isSending } = useMutation<ChatResponse, Error, { userId?: string; message: string }>({
    mutationFn: sendChatMessage,
    onSuccess: (response) => {
      // Add assistant response to messages
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          text: response.text,
          sender: 'assistant' as const,
          timestamp: new Date(),
        },
      ]);
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || isSending) return;

    // Provide haptic feedback for better user experience
    lightImpact();

    // Add user message to messages
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: message.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input
    setMessage('');

    // Send message to API with haptic feedback on completion
    sendMessage({
      userId: user?.id,
      message: userMessage.text,
    }, {
      onSuccess: () => successNotification(),
      onError: () => errorNotification()
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    const theme = useTheme();
    
    return (
      <Card
        backgroundColor={isUser ? '$blue10' : '$gray3'}
        alignSelf={isUser ? 'flex-end' : 'flex-start'}
        maxWidth="80%"
        padding="$3"
        marginBottom="$2"
        borderRadius="$4"
        borderTopRightRadius={isUser ? '$1' : '$4'}
        borderTopLeftRadius={isUser ? '$4' : '$1'}
        elevate
        pressStyle={{ opacity: 0.96 }}
        animation="bouncy"
        testID={isUser ? 'user-message' : 'assistant-message'}
        accessibilityLabel={`${isUser ? 'Your' : 'Assistant'} message: ${item.text}`}
        accessibilityRole="text"
      >
        <Text 
          color={isUser ? 'white' : '$color'} 
          fontSize="$4"
          fontWeight={isUser ? '$5' : '$4'}
          selectable
        >
          {item.text}
        </Text>
        <Text 
          color={isUser ? theme.gray4?.val || '#a1a1aa' : theme.gray9?.val || '#71717a'} 
          fontSize="$2" 
          marginTop="$1"
          textAlign={isUser ? 'right' : 'left'}
        >
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Card>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View flex={1} backgroundColor="$background">
          {isLoading ? (
            <YStack flex={1} justifyContent="center" alignItems="center">
              <Spinner size="large" color="$primary" accessibilityLabel="Loading messages" />
              <Text 
                color="$gray10" 
                fontSize="$4"
                marginTop="$4"
                accessibilityRole="text"
                testID="loading-text"
              >
                Loading conversation...
              </Text>
            </YStack>
          ) : messages.length === 0 ? (
            <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
              <Card padding="$4" width="100%" backgroundColor="$gray2" elevate bordered>
                <Text 
                  fontSize="$5" 
                  fontWeight="$6" 
                  textAlign="center" 
                  marginBottom="$2"
                  color="$color"
                >
                  No Messages Yet
                </Text>
                <Text 
                  fontSize="$4" 
                  textAlign="center" 
                  color="$gray10"
                  marginBottom="$4"
                >
                  Start a conversation with your Astro Assistant by sending a message below.
                </Text>
                <Button 
                  onPress={() => {
                    // Start app tour if available
                    successNotification();
                    // Focus the input field
                    if (inputRef.current) {
                      setTimeout(() => {
                        inputRef.current?.focus();
                      }, 500);
                    }
                  }}
                  backgroundColor="$primary"
                  color="white"
                  marginHorizontal="$10"
                  testID="start-chat"
                  accessibilityLabel="Start chatting"
                  accessibilityHint="Double tap to see examples of questions you can ask"
                >
                  Get Started
                </Button>
              </Card>
            </YStack>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item: Message) => item.id}
              contentContainerStyle={{ padding: 16, paddingBottom: 16 }}
            />
          )}

          <XStack 
            padding="$4" 
            paddingTop="$2" 
            paddingBottom={Math.max(insets.bottom, 16)} 
            backgroundColor="$background" 
            borderTopWidth={1} 
            borderTopColor="$borderColor"
            alignItems="flex-end"
          >
            <XStack 
              flex={1} 
              backgroundColor="$gray2" 
              borderRadius="$6" 
              position="relative"
              alignItems="center"
              paddingLeft="$3"
              paddingRight="$10"
            >
              <Input
                ref={inputRef}
                flex={1}
                paddingVertical="$2"
                fontSize="$4"
                placeholder="Ask your astrological question..."
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
                backgroundColor="transparent"
                borderWidth={0}
                testID="chat-input"
                accessibilityLabel="Message input field"
                accessibilityHint="Type your astrological question here"
              />
              <Button
                ref={sendButtonRef}
                position="absolute"
                right="$2"
                bottom="$2"
                width="$8"
                height="$8"
                borderRadius="$6"
                backgroundColor={message.trim() ? "$primary" : "$gray8"}
                justifyContent="center"
                alignItems="center"
                onPress={handleSendMessage}
                disabled={!message.trim() || isSending}
                testID="send-button"
                accessibilityLabel="Send message"
                accessibilityHint="Double tap to send your message"
                animation="bouncy"
                pressStyle={{ scale: 0.95 }}
              >
                {isSending ? (
                  <Spinner size="small" color="white" />
                ) : (
                  <Ionicons name="send" size={20} color="white" />
                )}
              </Button>
            </XStack>
          </XStack>
      </View>
    </KeyboardAvoidingView>
  );
}

