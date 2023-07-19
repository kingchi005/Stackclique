import { StyleSheet, Text, View, Dimensions, Animated} from 'react-native'
import React, { useEffect, useRef } from 'react'

const SplashScreen = ({navigation}) => {

    const Width = Dimensions.get('window').width;
    const Height = Dimensions.get('window').height;
    const animation = useRef(new Animated.Value(0)).current
    const startAnimation = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    };
    useEffect(() =>{
        setTimeout(() => {
            // navigation.navigate('Onboard')
            startAnimation()
        }, 2000)
    }, [])
  return (
    <View style={[styles.container, {width: Width, height: Height}]}>
        <Animated.Text style={[styles.text, 
        {transform: [
            {
                scale:animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 30]
                }),
            }
        ]}]}>STACKCLIQUE</Animated.Text>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7E0772',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#FFFFFF',
        fontWeight: '300',
        fontSize: 30,
    }
})