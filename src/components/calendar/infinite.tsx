import { View } from "@/theme";
import { useRef, useState } from "react";
import { FlatList, useWindowDimensions } from "react-native";
import React from "react";

export const PAGE_LOAD_SIZE = 3;
const INITIAL_NUMBER_TO_RENDER = PAGE_LOAD_SIZE * 2 + 1;
const PAGE_LOAD_THRESHOLD = 1;

type InfiniteCalendarProps<T> = {
  initialData: T[];
  initialDataIndex: number;
  loadMore: (data: T[], loadSize: number) => T[];
  loadPrevious: (data: T[], loadSize: number) => T[];
  onSelect: (data: T) => void;
  keyExtractor: (data: T) => string;
  render: (data: T, index: number) => React.ReactNode;
};

// todo: optimize the flatlist
export function InfiniteCalendar<T>({
  initialData,
  initialDataIndex,
  loadMore,
  loadPrevious,
  onSelect,
  keyExtractor,
  render,
}: InfiniteCalendarProps<T>) {
  const hasInitiallyScrolled = useRef(false);
  const hasSelectedInitialDate = useRef(false);
  const flatListRef = useRef<FlatList>(null);
  const [data, setData] = useState<T[]>([...initialData]);

  const { width } = useWindowDimensions();

  const handleScrollToInitialValue = () => {
    if (!hasInitiallyScrolled.current) {
      flatListRef.current?.scrollToIndex({
        index: initialDataIndex,
        animated: false,
      });
      hasInitiallyScrolled.current = true;
    }
  };

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      snapToInterval={width * 0.94}
      decelerationRate="fast"
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 0.5 }}
      initialNumToRender={INITIAL_NUMBER_TO_RENDER}
      onViewableItemsChanged={({ viewableItems }) => {
        if (
          viewableItems &&
          viewableItems.length > 0 &&
          hasInitiallyScrolled.current
        ) {
          if (hasSelectedInitialDate.current) {
            onSelect(viewableItems[0].item);
          }
          hasSelectedInitialDate.current = true;
        }
      }}
      renderItem={({ item, index }) => (
        <View
          onLayout={() => {
            if (index === data.length - 1) {
              handleScrollToInitialValue();
            }
          }}
        >
          {render(item, index)}
        </View>
      )}
      onEndReachedThreshold={PAGE_LOAD_THRESHOLD}
      onEndReached={() => setData((data) => loadMore(data, PAGE_LOAD_SIZE))}
      onStartReachedThreshold={PAGE_LOAD_THRESHOLD}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
      onStartReached={() => {
        if (hasInitiallyScrolled.current) {
          setData((data) => loadPrevious(data, PAGE_LOAD_SIZE));
        }
      }}
      keyExtractor={(item, _) => keyExtractor(item)}
    />
  );
}
