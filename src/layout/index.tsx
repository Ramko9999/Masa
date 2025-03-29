import {
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Splash } from "@/screens/splash";
import { RootStackParamList, TabParamList } from "./types";
import { LocationPermission } from "@/screens/location-permission";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UpcomingFestivals } from "@/screens/tabs/upcoming-festivals";
import { FestivalDetails } from "@/screens/festival-details";
import { Home } from "@/screens/tabs/home";
import { CustomTabBar } from './tab-bar';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "shift"
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          title: "Home"
        }}
      />
      <Tab.Screen
        name="upcoming_festivals"
        component={UpcomingFestivals}
        options={{
          title: "Upcoming Festivals",
        }}
      />
    </Tab.Navigator>
  );
}

export function Layout() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="tabs" component={Tabs} />
        <Stack.Screen name="festival_details" component={FestivalDetails} />
        <Stack.Screen name="location_permission" component={LocationPermission} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
