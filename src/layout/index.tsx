import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Root } from "../screens/root";

const RootStack = createStackNavigator({
  screens: {
    root: {
      screen: Root,
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
