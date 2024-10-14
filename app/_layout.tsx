import { Stack } from "expo-router";
import { RootSiblingParent } from 'react-native-root-siblings';

export default function RootLayout() {
  return (
    <RootSiblingParent>
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
    </RootSiblingParent>

  );
}
