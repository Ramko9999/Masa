import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "user_onboarding_education_complete";

async function hasSeenOnboarding(): Promise<boolean> {
  return false;
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === "true";
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}

async function markOnboardingComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch (error) {
    console.error("Error saving onboarding status:", error);
  }
}

export const UserApi = {
  hasSeenOnboarding,
  markOnboardingComplete,
};
