import { Image, ImageSourcePropType, StyleSheet, useWindowDimensions } from "react-native";
import { Text } from "../../../theme";

const imageBackgroundStyles = StyleSheet.create({
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }
})

type ImageBackgroundProps = {
    image: ImageSourcePropType
}

export function ImageBackground({ image }: ImageBackgroundProps) {
    const { width, height } = useWindowDimensions();
    return <Image
        resizeMode="cover"
        style={[
            {
                width: width,
                height: height * 0.3,
            },
            imageBackgroundStyles.container,
        ]}
        source={image}
    />
}

export type InfoSlide = {
    background: React.ReactNode;
    backgroundColor: string;
    textWrapColor: string;
    description: React.ReactNode;
};

const infoSlideTextStyles = StyleSheet.create({
    base: {
        color: "white",
        fontSize: 16,
    },
    italic: {
        fontStyle: "italic",
    },
});

export function Sig({ children }: { children: React.ReactNode }) {
    return (
        <Text style={[infoSlideTextStyles.base, infoSlideTextStyles.italic]} bold>
            {children}
        </Text>
    );
}

export function Base({ children }: { children: React.ReactNode }) {
    return <Text style={infoSlideTextStyles.base}>{children}</Text>;
}