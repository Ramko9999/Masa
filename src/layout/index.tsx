import {
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Root } from "@/screens/root";
import { Splash } from "@/screens/splash";
import { RootStackParamList } from "./types";
import { LocationPermission } from "@/screens/location-permission";
const Stack = createStackNavigator<RootStackParamList>();


export function Layout() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="root" component={Root} />
        <Stack.Screen name="location_permission" component={LocationPermission} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
