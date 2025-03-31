import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "dummy-3/31-user_onboarding_complete-v6";

async function hasSeenOnboarding(): Promise<boolean> {
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
