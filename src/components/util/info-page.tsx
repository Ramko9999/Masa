import React, { ReactNode } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "@/theme";
import { InfoHeader } from "./info-header";
import { StyleUtils } from "@/theme/style-utils";

export interface InfoPageProps {
  title: string;
  children: ReactNode;
  showBackButton?: boolean;
}

const infoPageStyles = StyleSheet.create({
  container: {
    ...StyleUtils.flexColumn(),
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: "3%",
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: "4%",
  },
  sectionTitle: {
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 22,
  },
  footer: {
    height: 30,
  },
  section: {
    ...StyleUtils.flexColumn(),
    marginBottom: 32,
  },
  spacer: {
    height: 16,
  },
  label: {
    marginBottom: 4,
  },
  visual: {
    marginBottom: 32,
  },
  noteContainer: {
    alignItems: "center",
  }
});

export function InfoPage({ title, children, showBackButton = true }: InfoPageProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[infoPageStyles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={infoPageStyles.scrollView}
      >
        {showBackButton && <InfoHeader />}
        <View style={infoPageStyles.headerContainer}>
          <Text huge bold>
            {title}
          </Text>
        </View>
        {children}
        <View style={infoPageStyles.footer} />
      </ScrollView>
    </View>
  );
}

export function InfoSection({ children, style }: { children: ReactNode, style?: any }) {
  return <View style={[infoPageStyles.section, style]}>{children}</View>;
}

export function InfoVisual({ children, style }: { children: ReactNode, style?: any }) {
  return <View style={[infoPageStyles.visual, style]}>{children}</View>;
}

export function InfoParagraph({ children, style }: { children: ReactNode, style?: any }) {
  return <Text style={[infoPageStyles.paragraph, style]}>{children}</Text>;
}

export function InfoSectionTitle({ children, style }: { children: ReactNode, style?: any }) {
  return <Text large semibold style={[infoPageStyles.sectionTitle, style]}>{children}</Text>;
}

export function InfoSpacer() {
  return <View style={infoPageStyles.spacer} />;
}

export function InfoNote({ children, style }: { children: ReactNode, style?: any }) {
  return (
    <View style={infoPageStyles.noteContainer}>
      <Text tiny tint style={[{ fontStyle: "italic" }, style]}>
        {children}
      </Text>
    </View>
  );
}

export function InfoLabel({ children, style }: { children: ReactNode, style?: any }) {
  return <Text medium style={[infoPageStyles.label, style]}>{children}</Text>;
} 