import { StyleSheet, ViewStyle, useWindowDimensions } from "react-native";
import { BottomSheet, BottomSheetRef } from "./index";
import { forwardRef, useImperativeHandle, useRef } from "react";

const MINI_SHEET_HEIGHT = 0.42;

const miniSheetStyles = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 1,
        overflow: "hidden",
    },
});

export type MiniSheetRef = BottomSheetRef;

type MiniSheetProps = {
    show: boolean;
    onHide: () => void;
    children: React.ReactNode;
    contentStyle?: ViewStyle;
};

export const MiniSheet = forwardRef<MiniSheetRef, MiniSheetProps>(({ show, onHide, children, contentStyle }, ref) => {
    const { height } = useWindowDimensions();
    const sheetRef = useRef<BottomSheetRef>(null);

    useImperativeHandle(ref, () => ({
        hide: () => sheetRef.current?.hide(),
    }));

    return (
        <BottomSheet
            ref={sheetRef}
            show={show}
            onHide={onHide}
            contentHeight={height * MINI_SHEET_HEIGHT}
            contentStyle={{ ...miniSheetStyles.container, ...contentStyle }}
        >
            {children}
        </BottomSheet>
    );
});
