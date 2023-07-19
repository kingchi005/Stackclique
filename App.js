import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator , TransitionPresets} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen, LoginScreen, OnboardingScreen, SignUpScreen, SplashScreen } from './src/screens';
import { TailwindProvider } from 'tailwindcss-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {

  const Stack = createNativeStackNavigator();
  const [isFirstLaunch, setFirstLaunch] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then(value => {
      if(value === null){
        AsyncStorage.setItem("alreadyLaunched", "true");
        setFirstLaunch(true);
      }else{
        setFirstLaunch(false)
      }
    })
  }, [])

  return (
    <TailwindProvider>
      <StatusBar style='auto'/>
      <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name='Splash' component={SplashScreen} options={{headerShown: false}}/> */}
        {!isFirstLaunch && (
          <Stack.Screen name='Onboard' component={OnboardingScreen} options={{headerShown: false}}/>
        )}
        <Stack.Screen name='LogIn' component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name='SignUp' component={SignUpScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Home' component={HomeScreen}/>
      </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
}