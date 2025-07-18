import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons'



const RideMap = () => {
    return(
       
        <View style={styles.container}>
          <Ionicons name='location-outline' color='#808080' size={40} />
             <Text style={styles.text}>Interactive Map will show here</Text>
            <Text color='#808080'>Live Vehicle location and routes</Text>
        </View>
   
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderColor: '#ccc',
    width:'100%',
    height:'20%',

  },
 
  text: {
    fontSize: 20,
    color: '#808080',
  },
   
});



export default RideMap;
