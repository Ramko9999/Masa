import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "../screens/home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Upcoming } from "../screens/upcoming";
import { TabBar } from "../components/util/tab-bar";
import React from "react";

const Tabs = createBottomTabNavigator({
  tabBar: (props) => <TabBar {...props} />,
  screenOptions: {
    tabBarStyle: {
      position: "absolute",
    },
  },
  screens: {
    home: {
      screen: Home,
      options: { headerShown: false },
    },
    upcoming: {
      screen: Upcoming,
      options: { headerShown: false },
    },
  },
});

const RootStack = createStackNavigator({
  screens: {
    tabs: {
      screen: Tabs,
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
