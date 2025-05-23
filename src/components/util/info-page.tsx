import React, { ReactNode } from "react";
import { StyleSheet, ScrollView, ColorSchemeName } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "@/theme";
import { InfoHeader } from "./info-header";
import { StyleUtils } from "@/theme/style-utils";
import { useGetColor, AppColor, useThemedStyles } from "@/theme/color";

export interface InfoPageSectionTranslation {
  title: string;
  paragraphs: string[];
}

export interface InfoPageProps {
  title: string;
  children: ReactNode;
  showBackButton?: boolean;
}

const infoPageStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    ...StyleUtils.flexColumn(),
    backgroundColor: useGetColor(AppColor.background, theme),
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: "35%",
  },
  scrollView: {
    paddingHorizontal: "3%",
  },
  headerContainer: {
    marginBottom: "5%",
    marginTop: "4%",
  },
  paragraph: {
    marginBottom: "3%",
    lineHeight: 22,
  },
  footer: {
    height: "8%",
  },
  sectionTitle: {
    marginBottom: "3%",
  },
  section: {
    ...StyleUtils.flexColumn(),
    marginBottom: "4%",
  },
  spacer: {
    height: "4%",
  },
  label: {
    marginBottom: "1%",
  },
  visual: {
    marginBottom: "8%",
  },
  noteContainer: {
    alignItems: "center",
  },
});

export function InfoPage({
  title,
  children,
  showBackButton = true,
}: InfoPageProps) {
  const insets = useSafeAreaInsets();

  const infoPageStyles = useThemedStyles(infoPageStylesFactory);

  return (
    <View style={[infoPageStyles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={infoPageStyles.scrollViewContent}
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

export function InfoSection({
  children,
  style,
}: {
  children: ReactNode;
  style?: any;
}) {
  const infoPageStyles = useThemedStyles(infoPageStylesFactory);
  return <View style={[infoPageStyles.section, style]}>{children}</View>;
}

export function InfoVisual({
  children,
  style,
}: {
  children: ReactNode;
  style?: any;
}) {
  const infoPageStyles = useThemedStyles(infoPageStylesFactory);
  return <View style={[infoPageStyles.visual, style]}>{children}</View>;
}

export function InfoParagraph({
  children,
  style,
}: {
  children: ReactNode;
  style?: any;
}) {
  const infoPageStyles = useThemedStyles(infoPageStylesFactory);
  return (
    <Text neutral style={[infoPageStyles.paragraph, style]}>
      {children}
    </Text>
  );
}

export function InfoSectionTitle({
  children,
  style,
}: {
  children: ReactNode;
  style?: any;
}) {
  const infoPageStyles = useThemedStyles(infoPageStylesFactory);
  return (
    <Text large semibold style={[infoPageStyles.sectionTitle, style]}>
      {children}
    </Text>
  );
}

export function InfoSpacer() {
  const infoPageStyles = useThemedStyles(infoPageStylesFactory);
  return <View style={infoPageStyles.spacer} />;
}

export function InfoNote({
  children,
  style,
}: {
  children: ReactNode;
  style?: any;
}) {
  const infoPageStyles = useThemedStyles(infoPageStylesFactory);
  return (
    <View style={infoPageStyles.noteContainer}>
      <Text tiny tint style={[{ fontStyle: "italic" }, style]}>
        {children}
      </Text>
    </View>
  );
}

export function InfoLabel({
  children,
  style,
}: {
  children: ReactNode;
  style?: any;
}) {
  const infoPageStyles = useThemedStyles(infoPageStylesFactory);
  return (
    <Text medium style={[infoPageStyles.label, style]}>
      {children}
    </Text>
  );
}
