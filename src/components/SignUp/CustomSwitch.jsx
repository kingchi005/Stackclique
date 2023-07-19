import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

export default function CustomSwitch({ selectionMode, switch1, switch2, onSelectSwitch }) {
    const [getSelectionMode, setSelectionMode] = useState(selectionMode)
    const updateSwitchData = (value) => {
        setSelectionMode(value);
        onSelectSwitch(value);
    };
  return (
    <View style={{ height: 55, width: '100%', backgroundColor: '#FFFFFF', flexDirection: 'row',  borderColor: '#E2E2E2', justifyContent: 'center', borderRadius: 15, borderWidth: 1.5}}>
        <TouchableOpacity
            activeOpacity={1} 
            onPress={() => {updateSwitchData(1)}}
            style={{
                flex: 1,
                backgroundColor: getSelectionMode == 1 ? '#7E0772' : '#ffffff',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                borderWidth: 4,
                borderColor: '#FFFFFF'
            }}
        >
            <Text 
                style={{
                    color: getSelectionMode == 1 ? '#FFFFFF' : 'gray',
                    fontSize: 14,
                    fontWeight: '500'
                }}>{switch1}</Text>
        </TouchableOpacity>
        <TouchableOpacity
            activeOpacity={1} 
            onPress={() => {updateSwitchData(2)}}
            style={{
                flex: 1,
                backgroundColor: getSelectionMode == 2 ? '#7E0772' : '#FFFFFF',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                borderWidth: 4,
                borderColor: '#FFFFFF'
            }}
        >
            <Text 
                style={{
                    color: getSelectionMode == 2 ? '#FFFFFF' : 'gray',
                    fontSize: 14,
                    fontWeight: '500'
                }}>{switch2}</Text>
        </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({})