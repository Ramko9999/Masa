import { View, Text } from "../theme";
import { useGetColor } from "../theme/color";

export function Upcoming() {
  return (
    <View style={{ flex: 1, backgroundColor: useGetColor("background") }}>
      <Text>Upcoming</Text>
    </View>
  );
}
