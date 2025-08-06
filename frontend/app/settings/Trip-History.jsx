import { ScrollView } from "react-native";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function TripHistory(){
    return(
        <ScrollView style = {styles.screen}>
              <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4682B4" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Trips</Text>
            </View>

{/* view content. */}
            <View style={styles.sectionView}>
                <Text style={styles.subHeader}>Rides</Text>
                <View>

                </View>
                </View>
            

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        marginTop: 40,
        padding: 20,


    }, 

    headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
    headerText:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 90,

    }, 
    sectionView:{
        marginTop: 50,


    }, 
    subHeader:{
    marginTop: 25,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
        
    }


})