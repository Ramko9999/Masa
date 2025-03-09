import { useState } from "react";
import { BottomSheet } from "../components/util/sheet";
import { View, Text } from "../theme";
import { StyleUtils } from "../theme/style-utils";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleUtils.flexRowCenterAll(10),
  },
});

export function Home() {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <View style={styles.container}>
        <Text>Home</Text>
        <TouchableOpacity onPress={() => setShowDialog(true)}>
          <Text>Click me to show dialog</Text>
        </TouchableOpacity>
      </View>
      <Dialog show={showDialog} onHide={() => setShowDialog(false)} />
    </>
  );
}

const dialogStyles = StyleSheet.create({
  container: {
    borderRadius: 10,
    flex: 1,
    ...StyleUtils.flexRowCenterAll(),
    backgroundColor: "white",
  },
});

type DialogProps = {
  show: boolean;
  onHide: () => void;
};

function Dialog({ show, onHide }: DialogProps) {
  const { height } = useWindowDimensions();
  return (
    <BottomSheet
      show={show}
      onHide={onHide}
      contentHeight={height * 0.4}
      contentStyle={dialogStyles.container}
    >
      <Text>Dialog</Text>
    </BottomSheet>
  );
}
