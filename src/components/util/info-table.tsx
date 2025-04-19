import React from "react";
import { ColorSchemeName, StyleSheet } from "react-native";
import { Text, View } from "@/theme";
import { AppColor, useGetColor, useThemedStyles } from "@/theme/color";
import { StyleUtils } from "@/theme/style-utils";

export interface Column {
  header: string;
  key: string;
  flex?: number;
}

export interface InfoTableProps {
  columns: Column[];
  data: Record<string, string>[];
  style?: any;
}

const infoTableStylesFactory = (
  theme: ColorSchemeName
): StyleSheet.NamedStyles<any> => ({
  container: {
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: useGetColor(AppColor.border, theme),
    borderRadius: 6,
    overflow: "hidden",
  },
  row: {
    ...StyleUtils.flexRow(),
    borderBottomWidth: 1,
    borderBottomColor: useGetColor(AppColor.border, theme),
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    textAlign: "left",
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    textAlign: "left",
  },
});

export function InfoTable({ columns, data, style }: InfoTableProps) {
  const infoTableStyles = useThemedStyles(infoTableStylesFactory);

  return (
    <View style={[infoTableStyles.container, style]}>
      <View style={infoTableStyles.row}>
        {columns.map((column) => (
          <Text
            key={column.key}
            semibold
            style={[infoTableStyles.header, { flex: column.flex || 1 }]}
          >
            {column.header}
          </Text>
        ))}
      </View>
      {data.map((row, index) => (
        <View key={index} style={infoTableStyles.row}>
          {columns.map((column) => (
            <Text
              key={`${index}-${column.key}`}
              style={[infoTableStyles.cell, { flex: column.flex || 1 }]}
            >
              {row[column.key]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
