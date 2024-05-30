import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const CommonBtn = ({ w, h, txt, onClick , status}) => {
    return (
        <TouchableOpacity
            onPress={() => {
                onClick();
            }} 
            style={{alignSelf: 'center', marginTop: 10, marginBottom: 10}}   >
            <LinearGradient
                colors={['#009FFD', '#2A2A72']}
                style={{
                    width: w,
                    height: h,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                }}
            >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', }}>{txt}</Text>
            </LinearGradient>

        </TouchableOpacity>
    );
};

export default CommonBtn;
