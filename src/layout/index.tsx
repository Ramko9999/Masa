import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "../screens/home";

const RootStack = createStackNavigator({
  screens: {
    home: {
      screen: Home,
      options: {
        headerShown: false,
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
