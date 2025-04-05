import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/theme";
import { AppColor, useGetColor } from "@/theme/color";
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

const infoTableStyles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: useGetColor(AppColor.border),
    borderRadius: 6,
    overflow: "hidden",
  },
  row: {
    ...StyleUtils.flexRow(),
    borderBottomWidth: 1,
    borderBottomColor: useGetColor(AppColor.border),
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 2,
    textAlign: "left",
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 2,
    textAlign: "left",
  },
});

export function InfoTable({ columns, data, style }: InfoTableProps) {
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