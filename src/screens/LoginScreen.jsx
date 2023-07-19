import { StyleSheet, Text, View, ScrollView, SafeAreaView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSwitch from '../components/LogIn/CustomSwitch'
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneBox from '../components/LogIn/PhoneBox';
import EmailBox from '../components/LogIn/EmailBox';

const LoginScreen = () => {

  // Switch Function 
  const [phoneTab, setPhoneTab ] = useState(1);
  const [emailTab , setEmailTab ] = useState(2);
  const onSelectSwitch = (value) => {
    setPhoneTab(value);
  }

  // Func First Login Text 
  const [isFirstLogin, setFirstLogin] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem("alreadyLogin").then(value => {
      if(value === null){
        AsyncStorage.setItem("alreadyLogin", "true");
        setFirstLogin(true);
      }else{
        setFirstLogin(false)
      }
    })
  }, [])
  return (
    <SafeAreaView style={styles.container}>
        <View style={{paddingTop: 50,}}>
          <Image source={require("../../assets/Wordmark.png")} style={{width: "85%", height: 50, alignSelf: 'center',}}/>
        </View>
        <View style={{paddingTop: 50,}}>
          <Text style={styles.text}>Login</Text>
          {!isFirstLogin ?(
            <Text style={{color: 'gray', fontSize: 16, fontWeight: '500', padding: 10}}>
              Welcome.
            </Text>
          ): 
            <Text style={{color: 'gray', fontSize: 18, fontWeight: '500', padding: 10}}>
              Welcome Back!
            </Text>
          }
        </View>
        <ScrollView style={{padding: 10}}>
        {/* <View style={{padding: 10, flex: -1}}> */}
          <CustomSwitch 
            selectionMode={1} 
            switch1={'Phone Number'} 
            switch2={'Email'}
            onSelectSwitch={onSelectSwitch}
          />
        {/* </View> */}
          {phoneTab == 1 && <PhoneBox/>}
          {phoneTab == 2 && <EmailBox/>}
        </ScrollView>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  text: {
    fontSize: 30,
    fontWeight: '800',
    color: 'black',
    padding: 10
  }
})