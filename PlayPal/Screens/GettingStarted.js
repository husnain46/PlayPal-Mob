import React from 'react';
import { 
    SafeAreaView,
    View,
    TouchableOpacity, 
    StyleSheet,
    Text, 
    ImageBackground, 
    Dimensions 
} from 'react-native';

const { width, height } = Dimensions.get('window');

const GettingStarted = ({ navigation }) => {

    const signupScreen = () => {
        navigation.navigate('SignUp');
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground 
                source={require('../Assets/BGs/welcomePic1.png')}
                style={styles.bgImage}
                resizeMode='stretch'
            >
                <View style={styles.btnView}>
                    <TouchableOpacity onPress={()=> signupScreen()}>
                        <Text style={styles.btnText}>Get Started</Text>
                    </TouchableOpacity>
                </View>    
            </ImageBackground>
            
        
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        flex: 1,
        width: width, 
        height: height
    },
    btnView:{
        position:'relative',
        margin: 80,
        marginTop: 700,
        width: 230, 
        height: 60, 
        borderRadius: 12, 
        backgroundColor:'#442d65'
    },
    btnText: {
        textAlign: 'center',
        paddingTop: 14,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22
    },
  });
  

export default GettingStarted;
