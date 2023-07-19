import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    useWindowDimensions,
  } from 'react-native';
  import React from 'react';
  import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedRef,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    withTiming
  } from 'react-native-reanimated';
import CustomButton from '../components/Onboarding/CustomButton.jsx';
import Pagination from '../components/Onboarding/Pagination.jsx';
import data from '../components/Onboarding/data.jsx';
import { useNavigation } from '@react-navigation/native';

  const OnboardingScreen = () => {
    const {width: SCREEN_WIDTH} = useWindowDimensions();
    const flatListRef = useAnimatedRef(null);
    const x = useSharedValue(0);
    const flatListIndex = useSharedValue(0);
    const navigation = useNavigation();
  
    const onViewableItemsChanged = ({viewableItems}) => {
      flatListIndex.value = viewableItems[0].index;
    };
  
    const onScroll = useAnimatedScrollHandler({
      onScroll: event => {
        x.value = event.contentOffset.x;
      },
    });
  
    const RenderItem = ({item, index}) => {
      const imageAnimationStyle = useAnimatedStyle(() => {
        const opacityAnimation = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [0, 1, 0],
          Extrapolate.CLAMP,
        );
        const translateYAnimation = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [100, 0, 100],
          Extrapolate.CLAMP,
        );
        return {
          opacity: opacityAnimation,
          width: SCREEN_WIDTH * 0.8,
          height: SCREEN_WIDTH * 0.8,
          transform: [{translateY: translateYAnimation}],
        };
      });
      const textAnimationStyle = useAnimatedStyle(() => {
        const opacityAnimation = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [0, 1, 0],
          Extrapolate.CLAMP,
        );
        const translateYAnimation = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [100, 0, 100],
          Extrapolate.CLAMP,
        );
  
        return {
          opacity: opacityAnimation,
          transform: [{translateY: translateYAnimation}],
        };
      });
      return (
        <View style={[styles.itemContainer, {width: SCREEN_WIDTH}]}>
          <Animated.Text style={[{marginLeft: 'auto', fontSize: 15, top: 50, color: 'gray', zIndex: 1, padding: 20}, textAnimationStyle]} onPress={() => {navigation.replace('LogIn')}}>{item.skip}</Animated.Text>
          <Animated.Image source={item.image} resizeMode={'contain'} style={imageAnimationStyle}/>
          <Animated.View style={[textAnimationStyle, {backgroundColor: '#FFFFFF',width: '85%', height: '45%', padding: 10, borderRadius: 15, borderColor: '#EFEFEF', marginBottom: 30}]}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemText}>{item.text}</Text>
          </Animated.View>
        </View>
      );
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Animated.FlatList
          ref={flatListRef}
          onScroll={onScroll}
          data={data}
          renderItem={({item, index}) => {
            return <RenderItem item={item} index={index} />;
          }}
          keyExtractor={item => item.id}
          scrollEventThrottle={16}
          horizontal={true}
          bounces={false}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            minimumViewTime: 300,
            viewAreaCoveragePercentThreshold: 10,
          }}
        />
        <View style={styles.bottomContainer}>
          <Pagination data={data} x={x} screenWidth={SCREEN_WIDTH} />
          <CustomButton
            flatListRef={flatListRef}
            flatListIndex={flatListIndex}
            dataLength={data.length}
          />
        </View>
      </SafeAreaView>
    );
  };
  
  export default OnboardingScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#EFEFEF',
    },
    itemContainer: {
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#EFEFEF',
    },
    itemTitle: {
      textAlign: 'center',
      fontSize: 25,
      fontWeight: 'bold',
      marginTop: 35,
      color: '#242424',
    },
    itemText: {
      color: '#24242480',
      top: 50,
      fontSize: 20,
      flexWrap: 'wrap'
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 10,
      paddingVertical: 10,
    },
  });
  