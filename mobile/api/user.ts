import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "user_onboarding_education_complete";
const LANGUAGE_KEY = "user_language";

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

async function setLanguage(language: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error("Error saving language:", error);
  }
}

async function getLanguage(): Promise<string> {
  try {
    const language = await AsyncStorage.getItem(LANGUAGE_KEY);
    return language || "en";
  } catch (error) {
    console.error("Error getting language:", error);
    return "en";
  }
}

export const UserApi = {
  hasSeenOnboarding,
  markOnboardingComplete,
  setLanguage,
  getLanguage
};
