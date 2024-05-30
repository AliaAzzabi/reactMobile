import { View, Text,Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const Header = ({title, icon, onPress}) => {
  return (
    <View style={styles.header}>
 
 <TouchableOpacity style={styles.backBtn} onPress={onPress} underlayColor="#ffffff00">
        <Image source={icon} style={styles.back}/>
      </TouchableOpacity>
    
      <Text style={[styles.title, { marginLeft: 10 }]}>{title}</Text>  
      </View>
  );
};

export default Header;

const styles = StyleSheet.create({
    header: {
      height: 80,
      width: '100%',
      flexDirection: 'row',
      backgroundColor: '#fff',
      elevation: 5,
      alignItems: 'center',
      paddingLeft: 40,
    },
    back: {
        width: 30,
        height: 25,
        left:30,
    //    marginRight: 30,
       
      },
      backBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'flex-end', 
        marginTop:15,
        right:55,
        //alignSelf: 'flex-end',

      },
      title: {
        fontSize: 24,
        fontWeight: '600',
        marginTop:16,
        right:30,
      },
  });
  
