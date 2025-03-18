import { Image, ImageSourcePropType, StyleSheet, useWindowDimensions } from "react-native";

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
                height: height * 0.25,
            },
            imageBackgroundStyles.container,
        ]}
        source={image}
    />
}