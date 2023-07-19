import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';
import { useNavigation } from '@react-navigation/native';

const PhoneBox = () => {
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ cca2: 'US', callingCode: '1' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountryPickerVisible(false);
  };

  const toggleCountryPicker = () => {
    setCountryPickerVisible(!countryPickerVisible);
  };

  const handleSignUp = () => {
    // Perform sign up logic here
    console.log('Country Code:', selectedCountry.callingCode);
    console.log('Phone Number:', phoneNumber);
  };

  return (
    <View style={styles.container}>
      {/* Start Of Country Flag and Arrow  */}
      <View style={styles.countryPicker}>
      <TouchableOpacity activeOpacity={0.5} onPress={toggleCountryPicker}>
        <View style={styles.countryBox}>
          <CountryPicker
            withFilter
            withFlagButton={true}
            withCallingCode
            withCallingCodeButton={false}
            withEmoji
            countryCode={selectedCountry.cca2}
            onSelect={handleCountrySelect}
            visible={countryPickerVisible}
            containerButtonStyle={styles.flagButtonContainer}
          />
          <AntDesign name={countryPickerVisible ? 'up' : 'down'} size={15} color="black" style={{right: 5, fontWeight: '800'}}/>
        </View>
      {/* End Of Country Flag and Arrow  */}

      {/* Start Of Country Flag and code Pop up filter  */}
        {countryPickerVisible && (
          <CountryPicker
            withFilter
            withFlag
            withCallingCode
            withEmoji
            countryCode={selectedCountry.cca2}
            onSelect={handleCountrySelect}
            visible
          />
        )}
      </TouchableOpacity>
      {/* End Of Country Flag and code Pop up filter  */}

      {/* Start Of Phone Input and country code Box  */}
      <View style={styles.phoneNumberContainer}>
        <Text style={styles.countryCodeInput}>{"+"} {selectedCountry.callingCode}</Text>
        <TextInput
          style={styles.phoneNumberInput}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
      {/* End Of Phone Input and country code Box  */}

      </View>
      <View style={{marginTop: 50, alignItems: 'center'}}>
        <Text style={{color: '#24242480', fontSize: 16, fontWeight: '500'}}>Or Login with</Text>
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
      <TouchableOpacity activeOpacity={0.8} style={{alignSelf: 'center', marginTop: 150}} onPress={() => {navigation.navigate('SignUp')}}>
        <View>
          <Text style={{fontSize: 15, fontWeight: '500', color: '#7E0772'}} >Click here to Sign up</Text>
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
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-around'
  },
  countryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E2E2',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  countryCodeInput: {
    fontSize: 15,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: 'gray',
    fontWeight: '500'
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E2E2',
    borderRadius: 10,
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
    width: '80%',
  },
  phoneNumberInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default PhoneBox;
