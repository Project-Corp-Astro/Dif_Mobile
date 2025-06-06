# Tamagui Migration Guide

This guide provides instructions for migrating from NativeWind/Tailwind CSS to Tamagui in our Expo React Native application.

## Why Migrate to Tamagui?

1. **Improved Build Performance**: Eliminates PostCSS async plugin errors and improves build times
2. **Compile-Time CSS Extraction**: Optimizes runtime performance with static extraction
3. **Consistent Theming**: Provides a robust theming system with light/dark mode support
4. **Type Safety**: Full TypeScript support for styling properties
5. **Native Components**: Built specifically for React Native with optimized native components

## Migration Steps

### 1. Configuration Setup (Completed)

- ✅ Removed NativeWind and Tailwind CSS dependencies
- ✅ Installed Tamagui and related dependencies
- ✅ Updated Babel and Metro configuration
- ✅ Created Tamagui configuration with tokens, themes, and shorthands
- ✅ Updated root layout with TamaguiProvider

### 2. Component Migration (In Progress)

#### Approach 1: Using Tamagui Components Directly

Replace React Native components with Tamagui components:

```jsx
// Before (React Native with StyleSheet)
import { View, Text, StyleSheet } from 'react-native';

function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});

// After (Tamagui)
import { YStack, Text } from 'tamagui';

function MyComponent() {
  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <Text fontSize="$7" fontWeight="$7" color="$color">Hello World</Text>
    </YStack>
  );
}
```

#### Approach 2: Using Custom UI Components

We've created reusable UI components to make migration easier:

```jsx
// Before (React Native with StyleSheet)
import { View, Text, StyleSheet } from 'react-native';

function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
}

// After (Using our custom UI components)
import { Screen, Heading } from '@components/ui';

function MyComponent() {
  return (
    <Screen>
      <Heading>Hello World</Heading>
    </Screen>
  );
}
```

#### Approach 3: Using Style Utilities

For complex styling, use our style utilities to convert React Native styles to Tamagui tokens:

```jsx
// Before (React Native with StyleSheet)
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});

// After (Using styleUtils)
import { createTamaguiStyle } from '@lib/styleUtils';

const tamaguiStyle = createTamaguiStyle({
  padding: 16,
  backgroundColor: '#fff',
  borderRadius: 8,
});

// Use in component
<YStack {...tamaguiStyle}>
  {/* content */}
</YStack>
```

### 3. Available Custom UI Components

We've created several custom UI components to make migration easier:

#### Text Components
- `<Text>` - Base text component with variants and size options
- `<Heading>` - For headings with size variants (small, medium, large, xlarge)
- `<Caption>` - For smaller text
- `<ErrorText>` - For error messages
- `<LinkText>` - For clickable text links
- `<Subheading>` - For section subheadings

#### Layout Components
- `<Screen>` - Full-screen container with safe area insets
- `<Container>` - Flexible container with variants (default, card)
- `<Section>` - Section container with bottom margin
- `<YStack>`, `<XStack>`, `<ZStack>` - Directional stack layouts

#### Interactive Components
- `<Button>` - Button with variants (primary, secondary, outline, ghost) and sizes
- `<IconButton>` - Square button optimized for icons
- `<Card>` - Card container with variants (elevated, outlined, flat)
- `<ActionCard>` - Interactive card for clickable areas
- `<CardHeader>` - Styled header section for cards
- `<CardFooter>` - Styled footer section for cards

#### Form Components
- `<Input>` - Text input with variants for state and size
- `<FormItem>` - Container for form fields with label and error handling
- `<Form>` - Form container component
- `<FormSection>` - Grouped section of form fields with title

#### List Components
- `<List>` - Container for lists with variants (plain, grouped)
- `<ListItem>` - Interactive list item with title, subtitle, icon support
- `<ListHeader>` - Styled header for list sections
- `<ListFooter>` - Styled footer for lists
- `<ListSeparator>` - Line separator between list items

#### Avatar Components
- `<Avatar>` - User avatar with size variants
- `<AvatarImage>` - Image component for avatars
- `<AvatarFallback>` - Fallback display when image is unavailable
- `<AvatarWithDetails>` - Avatar with name and description

#### Modal Components
- `<Modal>` - Customizable modal dialog
- `<ModalHeader>` - Header section for modals
- `<ModalBody>` - Content section for modals
- `<ModalFooter>` - Footer section for modals with actions

### 4. Theme Tokens

Tamagui uses tokens for consistent styling. Here are the main token categories:

- **Colors**: `$background`, `$color`, `$primary`, etc.
- **Spacing**: `$0` through `$16` (0px to 64px)
- **Font Sizes**: `$1` through `$14` (10px to 72px)
- **Font Weights**: `$1` through `$9` (100 to 900)
- **Radius**: `$0` through `$8` (0px to rounded)

### 5. Common Migration Patterns

#### NativeWind to Tamagui

```jsx
// Before (NativeWind)
<View className="flex-1 p-4 bg-white">
  <Text className="text-2xl font-bold text-gray-900">Hello</Text>
</View>

// After (Tamagui)
<YStack flex={1} padding="$4" backgroundColor="$background">
  <Text fontSize="$7" fontWeight="$7" color="$color">Hello</Text>
</YStack>
```

#### StyleSheet to Tamagui

```jsx
// Before (StyleSheet)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

// After (Tamagui)
// Option 1: Inline props
<YStack flex={1} padding="$4" backgroundColor="$background">

// Option 2: Styled component
const Container = styled(YStack, {
  flex: 1,
  padding: '$4',
  backgroundColor: '$background',
});
```

### 6. Next Steps

1. **Continue Incremental Migration**: Focus on one screen or component at a time, starting with simpler ones
   - The login screen has been fully migrated as a reference
   - Use the example screen at `/app/examples/tamagui-example.tsx` as a showcase of available components

2. **Migration Priority**:
   - First: Convert StyleSheet styles to Tamagui props and tokens
   - Second: Replace React Native components with Tamagui equivalents
   - Third: Replace NativeWind classes with Tamagui props
   - Fourth: Enhance components with Tamagui-specific features (variants, themes)

3. **Testing Strategy**:
   - Test each screen after migration to ensure visual and functional parity
   - Verify both light and dark mode appearance
   - Test on both iOS and Android

4. **Performance Optimization**:
   - Use the Tamagui Dev Tools to identify performance bottlenecks
   - Ensure proper use of memoization where needed
   - Leverage Tamagui's static extraction for optimal performance

5. **Final Cleanup**:
   - Remove all NativeWind/Tailwind CSS dependencies and configuration
   - Remove any unused StyleSheet imports and styles
   - Update documentation to reflect the new styling approach

## Resources

- [Tamagui Documentation](https://tamagui.dev/docs/intro/introduction)
- [Tamagui Components](https://tamagui.dev/docs/components/stacks)
- [Tamagui Theming](https://tamagui.dev/docs/intro/themes)
- [Tamagui Tokens](https://tamagui.dev/docs/intro/tokens)
