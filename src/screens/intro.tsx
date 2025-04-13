import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/layout/types";
import { View, Text } from "@/theme";
import { StyleSheet, useWindowDimensions, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColor, useGetColor } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useState } from "react";
import { UserApi } from "@/api/user";
import { IntroQuestionSlide } from "@/components/intro/slide/question";
import { IntroHinduCalendarSlide } from "@/components/intro/slide/hindu-calendar";
import { IntroGeocentricSlide } from "@/components/intro/slide/geocentric";
import { IntroRegionalVariantsSlide } from "@/components/intro/slide/regional-variants";
import { LocationApi } from "@/api/location";
import { useLocation } from "@/context/location";

const introHeaderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
    ...StyleUtils.flexRow(),
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    opacity: 0.9,
  },
});

type IntroHeaderProps = {
  onSkip: () => void;
  currentIndex: number;
  totalSlides: number;
};

function IntroHeader({ onSkip, currentIndex, totalSlides }: IntroHeaderProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  return (
    <View
      style={[
        introHeaderStyles.container,
        { paddingTop: insets.top, height: height * 0.12 },
      ]}
    >
      <IntroPagination length={totalSlides} currentIndex={currentIndex} />
      <TouchableOpacity onPress={onSkip}>
        <Text neutral style={introHeaderStyles.skipButton}>
          Skip
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const introPaginationStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexRow(8),
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "1%",
  },
  dot: {
    width: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: useGetColor(AppColor.primary),
    opacity: 0.3,
  },
  activeDot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: useGetColor(AppColor.primary),
    opacity: 1,
  },
});

type IntroPaginationProps = {
  length: number;
  currentIndex: number;
};

function IntroPagination({ length, currentIndex }: IntroPaginationProps) {
  return (
    <View style={introPaginationStyles.container}>
      {Array.from({ length }, (_, index) => (
        <Animated.View
          key={index}
          layout={LinearTransition.springify()}
          style={[
            index === currentIndex
              ? introPaginationStyles.activeDot
              : introPaginationStyles.dot,
          ]}
        />
      ))}
    </View>
  );
}

const introStyles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: useGetColor(AppColor.background),
  },
});

type IntroProps = StackScreenProps<RootStackParamList, "intro">;

export function Intro({ navigation }: IntroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setLocation } = useLocation();

  const handleOnboardingComplete = async () => {
    await UserApi.markOnboardingComplete();
    const locationPermissionStatus =
      await LocationApi.getLocationPermissionStatus();
    if (locationPermissionStatus.status === "granted") {
      const location = await LocationApi.readDeviceLocation();
      setLocation(location);
      navigation.navigate("notification_permission");
    } else {
      navigation.navigate("location_permission");
    }
  };

  const handleNext = async () => {
    if (currentIndex === 3) {
      await handleOnboardingComplete();
    } else {
      setCurrentIndex((index) => index + 1);
    }
  };

  const onHandleSkip = async () => {
    await handleOnboardingComplete();
  };

  return (
    <View style={introStyles.container}>
      <IntroHeader
        onSkip={onHandleSkip}
        totalSlides={4}
        currentIndex={currentIndex}
      />
      {currentIndex === 0 ? (
        <IntroQuestionSlide onNext={handleNext} />
      ) : currentIndex === 1 ? (
        <IntroHinduCalendarSlide onNext={handleNext} />
      ) : currentIndex === 2 ? (
        <IntroGeocentricSlide onNext={handleNext} />
      ) : (
        <IntroRegionalVariantsSlide onNext={handleNext} />
      )}
    </View>
  );
}
