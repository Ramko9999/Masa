import { View } from "../../../theme";
import { StyleSheet, useWindowDimensions, ViewabilityConfig } from "react-native";
import { StyleUtils } from "../../../theme/style-utils";
import { Pagination } from "../../util/pagination-indicator";
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InfoSlide } from "./util";
import { FlatList } from "react-native-gesture-handler";

const slideStyles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleUtils.flexColumn(5),
        justifyContent: "flex-start",
    },
    image: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    explanation: {
        marginHorizontal: "4%",
        paddingVertical: "2%",
        paddingHorizontal: "4%",
        borderRadius: 20,
        backgroundColor: "white",
    },
    description: {
        fontWeight: 400,
        fontSize: 16,
        color: "white"
    }
});

function Slide({ background, backgroundColor, textWrapColor, description }: InfoSlide) {
    return (
        <View style={[slideStyles.container, { backgroundColor }]}>
            {background}
            <View style={[slideStyles.explanation, { backgroundColor: textWrapColor }]}>
                {description}
            </View>
        </View>
    );
}

const slideShowStyles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleUtils.flexColumn(5),
        justifyContent: "flex-start",
    },
    pagination: {
        position: "absolute",
        width: "100%",

    }
});

type SlideShowProps = {
    slides: InfoSlide[]
}

// todo: issues with flatlist on android
export function SlideShow({ slides }: SlideShowProps) {
    const [slideIndex, setSlideIndex] = useState(0);
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const viewabilityConfig: ViewabilityConfig = {
        viewAreaCoveragePercentThreshold: 50,
    };

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setSlideIndex(viewableItems[0].index);
        }
    }, []);

    const renderItem = useCallback(({ item, index }: { item: InfoSlide, index: number }) => (
        <View key={index} style={{ width }}>
            <Slide {...item} />
        </View>
    ), [width]);

    return (
        <>
            <FlatList
                bounces={false}
                overScrollMode="never"
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                data={slides}
                snapToInterval={width}
                decelerationRate="fast"
                snapToAlignment="start"
                renderItem={renderItem}
            />
            <View style={[slideShowStyles.pagination, { bottom: insets.bottom }]}>
                <Pagination totalItemsCount={slides.length} currentIndex={slideIndex} />
            </View>
        </>
    );
}
