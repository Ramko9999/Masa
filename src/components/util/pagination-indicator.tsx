
import { View } from "@/theme";
import { StyleUtils } from "@/theme/style-utils";
import { StyleSheet } from "react-native";

const paginationDotStyles = StyleSheet.create({
    on: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    off: {
        width: 8,
        height: 8,
        borderRadius: 4,
        opacity: 0.5,
    },
});

type PaginationDotProps = {
    isOn: boolean;
};

function PaginationDot({ isOn }: PaginationDotProps) {
    return (
        <View
            style={[
                isOn ? paginationDotStyles.on : paginationDotStyles.off,
                { backgroundColor: "white" },
            ]}
        />
    );
}

const paginationStyles = StyleSheet.create({
    container: {
        ...StyleUtils.flexRowCenterAll(5)
    },
});

type PaginationProps = {
    totalItemsCount: number;
    currentIndex: number;
};

export function Pagination({ totalItemsCount, currentIndex }: PaginationProps) {
    return (
        <View style={paginationStyles.container}>
            {Array.from({ length: totalItemsCount }).map((_, index) => (
                <PaginationDot key={index} isOn={index === currentIndex} />
            ))}
        </View>
    );
}