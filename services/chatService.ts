import { supabase } from './supabaseClient';
import { io, Socket } from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

// Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string | null;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'system';
  metadata?: any;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'personal' | 'astrologer' | 'group';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants: {
    id: string;
    name: string;
    avatarUrl: string | null;
    isOnline: boolean;
  }[];
}

// Socket.io connection
let socket: Socket | null = null;

/**
 * Initialize chat service
 * @param userId - Current user ID
 */
export const initializeChatService = (userId: string): void => {
  // In a real app, this would connect to your actual chat server
  socket = io('https://your-chat-server.com', {
    auth: {
      userId,
    },
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('Connected to chat server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from chat server');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
};

/**
 * Disconnect from chat service
 */
export const disconnectChatService = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Hook for managing chat messages
 * @param roomId - Chat room ID
 * @param userId - Current user ID
 */
export const useChat = (roomId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        
        // Fetch messages from Supabase
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', roomId)
          .order('timestamp', { ascending: true })
          .limit(50);
        
        if (error) {
          throw new Error('Failed to fetch messages');
        }
        
        if (isMounted.current) {
          setMessages(data.map(msg => ({
            id: msg.id,
            senderId: msg.sender_id,
            receiverId: msg.receiver_id,
            content: msg.content,
            timestamp: msg.timestamp,
            isRead: msg.is_read,
            type: msg.type,
            metadata: msg.metadata,
          })));
          
          // Mark messages as read
          markMessagesAsRead(roomId, userId);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err as Error);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    fetchMessages();
    
    // Listen for new messages
    if (socket) {
      socket.on(`message:${roomId}`, (newMessage: Message) => {
        if (isMounted.current) {
          setMessages(prevMessages => [...prevMessages, newMessage]);
          
          // Provide haptic feedback for new message
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          
          // Mark message as read if it's not from the current user
          if (newMessage.senderId !== userId) {
            markMessageAsRead(newMessage.id);
          }
        }
      });
    }
    
    // Cleanup
    return () => {
      isMounted.current = false;
      if (socket) {
        socket.off(`message:${roomId}`);
      }
    };
  }, [roomId, userId]);

  /**
   * Send a message
   * @param content - Message content
   * @param type - Message type (default: 'text')
   * @param metadata - Optional metadata
   */
  const sendMessage = async (
    content: string,
    type: 'text' | 'image' | 'system' = 'text',
    metadata?: any
  ): Promise<void> => {
    try {
      // Generate a temporary ID for optimistic UI update
      const tempId = `temp-${Date.now()}`;
      
      // Create message object
      const message: Message = {
        id: tempId,
        senderId: userId,
        receiverId: null, // In a group chat, receiverId is null
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
        type,
        metadata,
      };
      
      // Optimistically add message to state
      setMessages(prevMessages => [...prevMessages, message]);
      
      // Provide haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // In a real app, send message to server
      if (socket) {
        socket.emit('send_message', {
          roomId,
          message: {
            ...message,
            id: undefined, // Server will generate the real ID
          },
        });
      }
      
      // Save message to Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            room_id: roomId,
            sender_id: userId,
            receiver_id: null,
            content,
            timestamp: message.timestamp,
            is_read: false,
            type,
            metadata,
          },
        ])
        .select()
        .single();
      
      if (error) {
        throw new Error('Failed to send message');
      }
      
      // Update message with real ID
      if (isMounted.current) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === tempId
              ? {
                  ...msg,
                  id: data.id,
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove failed message from state
      if (isMounted.current) {
        setMessages(prevMessages =>
          prevMessages.filter(msg => msg.id !== `temp-${Date.now()}`)
        );
      }
      
      // Provide error feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      throw error;
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};

/**
 * Fetch user's chat rooms
 * @param userId - User ID
 */
export const fetchChatRooms = async (userId: string): Promise<ChatRoom[]> => {
  try {
    // In a real app, this would fetch from your database
    // For now, we'll return mock data
    const { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        id,
        name,
        type,
        last_message,
        last_message_time,
        unread_count,
        participants:chat_room_participants(
          user_id,
          user:profiles(id, full_name, avatar_url)
        )
      `)
      .eq('chat_room_participants.user_id', userId);
    
    if (error) {
      throw new Error('Failed to fetch chat rooms');
    }
    
    // Transform data to match our interface
    return data.map(room => ({
      id: room.id,
      name: room.name,
      type: room.type,
      lastMessage: room.last_message,
      lastMessageTime: room.last_message_time,
      unreadCount: room.unread_count,
      participants: room.participants.map(participant => ({
        id: participant.user.id,
        name: participant.user.full_name,
        avatarUrl: participant.user.avatar_url,
        isOnline: false, // In a real app, this would be determined by your online status system
      })),
    }));
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    throw new Error('Failed to fetch chat rooms');
  }
};

/**
 * Mark messages as read
 * @param roomId - Chat room ID
 * @param userId - Current user ID
 */
export const markMessagesAsRead = async (
  roomId: string,
  userId: string
): Promise<void> => {
  try {
    // Update messages in Supabase
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('room_id', roomId)
      .neq('sender_id', userId)
      .eq('is_read', false);
    
    // In a real app, notify other users that messages have been read
    if (socket) {
      socket.emit('mark_messages_read', {
        roomId,
        userId,
      });
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

/**
 * Mark a single message as read
 * @param messageId - Message ID
 */
export const markMessageAsRead = async (messageId: string): Promise<void> => {
  try {
    // Update message in Supabase
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);
    
    // In a real app, notify other users that the message has been read
    if (socket) {
      socket.emit('mark_message_read', {
        messageId,
      });
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
};

/**
 * Create a new chat room
 * @param name - Room name
 * @param type - Room type
 * @param participantIds - IDs of participants
 */
export const createChatRoom = async (
  name: string,
  type: 'personal' | 'astrologer' | 'group',
  participantIds: string[]
): Promise<ChatRoom> => {
  try {
    // Create room in Supabase
    const { data: roomData, error: roomError } = await supabase
      .from('chat_rooms')
      .insert([
        {
          name,
          type,
          last_message: '',
          last_message_time: new Date().toISOString(),
          unread_count: 0,
        },
      ])
      .select()
      .single();
    
    if (roomError) {
      throw new Error('Failed to create chat room');
    }
    
    // Add participants
    const participantsToInsert = participantIds.map(userId => ({
      room_id: roomData.id,
      user_id: userId,
    }));
    
    const { error: participantsError } = await supabase
      .from('chat_room_participants')
      .insert(participantsToInsert);
    
    if (participantsError) {
      throw new Error('Failed to add participants to chat room');
    }
    
    // Fetch participant details
    const { data: participantsData, error: fetchError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', participantIds);
    
    if (fetchError) {
      throw new Error('Failed to fetch participant details');
    }
    
    // Return the created room
    return {
      id: roomData.id,
      name: roomData.name,
      type: roomData.type,
      lastMessage: roomData.last_message,
      lastMessageTime: roomData.last_message_time,
      unreadCount: roomData.unread_count,
      participants: participantsData.map(participant => ({
        id: participant.id,
        name: participant.full_name,
        avatarUrl: participant.avatar_url,
        isOnline: false,
      })),
    };
  } catch (error) {
    console.error('Error creating chat room:', error);
    throw new Error('Failed to create chat room');
  }
};

/**
 * Fetch chat history for a specific user
 * @param userId - User ID
 * @returns Array of messages
 */
export const fetchChatHistory = async (userId?: string): Promise<any[]> => {
  try {
    if (!userId) {
      return [];
    }
    
    // In a real app, this would fetch from your database
    // For now, we'll check if there's any data in Supabase first
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('timestamp', { ascending: true })
      .limit(50);
    
    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
    
    if (data && data.length > 0) {
      // Transform data to match the Message interface used in the chat screen
      return data.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.sender_id === userId ? 'user' : 'assistant',
        timestamp: new Date(msg.timestamp),
      }));
    }
    
    // If no messages found, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

// Mock AI responses for the chat feature
const mockAIResponses = [
  "Based on your astrological chart, this is a favorable time for new beginnings. Mercury is in a position that enhances communication and learning.",
  "Your ruling planet is currently in retrograde, which might explain why you've been feeling reflective lately. This is a good time for introspection rather than action.",
  "The current planetary alignment suggests potential challenges in relationships. Open communication will be key to navigating this period successfully.",
  "With Jupiter entering your sign, you're entering a period of growth and expansion. This is an excellent time to pursue new opportunities and take calculated risks.",
  "The lunar eclipse coming up will affect your emotional balance. Take extra care of your mental health during this time and practice mindfulness.",
  "Your career sector is being activated by Saturn, bringing structure and discipline to your professional life. Hard work now will lead to recognition later.",
  "Venus is highlighting your love life right now. If you're single, you might meet someone significant. If in a relationship, expect deeper connections.",
  "The current cosmic weather suggests focusing on financial planning. It's a good time to review your budget and consider long-term investments.",
  "Mars is energizing your health sector. This is an ideal time to start a new fitness routine or make positive changes to your wellness habits.",
  "The stars indicate a period of spiritual growth ahead. You might feel drawn to meditation, journaling, or other practices that connect you with your inner wisdom."
];

/**
 * Send a chat message and get AI response
 * @param params - Object containing userId and message
 * @returns AI response message
 */
export const sendChatMessage = async (params: { userId?: string; message: string }): Promise<{ text: string }> => {
  try {
    const { userId, message } = params;
    
    // In a real app, this would send the message to your AI service
    // and get a response based on the user's question
    
    // For now, we'll simulate a delay and return a mock response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get a random response from our mock responses
    const responseText = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
    
    // If we have a userId, save both messages to the database
    if (userId) {
      // Save user message
      const { error: userMsgError } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: userId,
            receiver_id: 'assistant',
            content: message,
            timestamp: new Date().toISOString(),
            is_read: true,
            type: 'text',
          },
        ]);
      
      if (userMsgError) {
        console.error('Error saving user message:', userMsgError);
      }
      
      // Save assistant response
      const { error: assistantMsgError } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: 'assistant',
            receiver_id: userId,
            content: responseText,
            timestamp: new Date().toISOString(),
            is_read: true,
            type: 'text',
          },
        ]);
      
      if (assistantMsgError) {
        console.error('Error saving assistant message:', assistantMsgError);
      }
    }
    
    return { text: responseText };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to send message');
  }
};
