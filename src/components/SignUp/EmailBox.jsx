import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EmailBox = () => {
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ cca2: 'US', callingCode: '1' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();

  const handleSignUp = () => {
    // Perform sign up logic here
    console.log('Country Code:', selectedCountry.callingCode);
    console.log('Phone Number:', phoneNumber);
  };

  return (
    <View style={styles.container}>
      {/* Start Of Country Flag and Arrow  */}
      <View style={styles.countryPicker}>
      {/* Start Of Phone Input and country code Box  */}
      <View style={styles.phoneNumberContainer}>
        <TextInput
          style={styles.phoneNumberInput}
          placeholder="Enter your email"
          keyboardType="email-address"
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
      {/* End Of Phone Input and country code Box  */}

      </View>
      <View style={{marginTop: 50, alignItems: 'center'}}>
        <Text style={{color: '#24242480', fontSize: 16, fontWeight: '500'}}>Or Sign Up with</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 20}}>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={{backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E2E2', borderRadius:15, paddingHorizontal: 35, paddingVertical: 10}}>
            <Image source={require("../../../assets/facebook.png")} style={{width: 40, height: 40, alignSelf: 'center'}}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={{backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E2E2', borderRadius:15, paddingHorizontal: 35, paddingVertical: 10}}>
            <Image source={require("../../../assets/google.png")} style={{width: 40, height: 40, alignSelf: 'center'}}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
          <View style={{backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E2E2', borderRadius:15, paddingHorizontal: 35, paddingVertical: 10}}>
            <Image source={require("../../../assets/apple.png")} style={{width: 40, height: 40, alignSelf: 'center'}}/>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity activeOpacity={0.8} style={{alignSelf: 'center', marginTop: 150}} onPress={() => {navigation.navigate('LogIn')}}>
        <View>
          <Text style={{fontSize: 15, fontWeight: '500', color: '#7E0772'}}>Click here to LogIn</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  countryPicker: {
    // flexDirection: 'row',
    marginTop: 10,
    // justifyContent: 'space-around'
  },
  
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E2E2',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  phoneNumberInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default EmailBox;
