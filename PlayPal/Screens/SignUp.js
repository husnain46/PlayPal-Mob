import React from 'react';
import { SafeAreaView,View,TouchableOpacity,Button,TouchableWithoutFeedback,Keyboard,Platform,TextInput,KeyboardAvoidingView, Image,StyleSheet, Text, ImageBackground, Dimensions } from 'react-native';

const SignUp = () => {

   
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.bgImageView}>
                <ImageBackground source={require("../Assets/BGs/blurPic.jpg")}
                    style={styles.bgImage}  
                    resizeMode='cover'>

                    <View>
                        <Image 
                            source={require("../Assets/Logo/Logo.png")}
                            style={styles.logoImg}
                        />

						<KeyboardAvoidingView
							behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
							style={styles.container2}>
							<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
								<View style={styles.inner}>
									<View style={styles.nameView}>
										<TextInput placeholder="First Name" style={styles.textInput1} />
										<TextInput placeholder="Second Name" style={styles.textInput2} />
									</View>

									<TextInput placeholder="Email" style={styles.textInput3} />
									
									<View style={styles.btnContainer}>
										<Button title="Submit" onPress={() => null} />
									</View>
								</View>
							</TouchableWithoutFeedback>
						</KeyboardAvoidingView>

                    </View>
                </ImageBackground>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    
	container: {
        flex: 1,
        backgroundColor: '#041e38'
    },
    bgImageView: { 
        width: '91%', 
        height: '95%',
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent:'center',
        marginTop:20,
        alignSelf:'center'
    },
    bgImage: {
        flex:1,
        alignItems:'center',
    },
    logoImg:{
        marginTop: 20,
		alignSelf: 'center',
        width: 230, 
        height: 60,
    },
    container2: {
		flex: 1,
	},
	inner: {
		marginTop:150,
		flex: 0.3,
		justifyContent: 'space-around',
	},
	nameView:{
		width:300,
		height:50,
		flexDirection:'row',
		marginTop:-100,
		justifyContent:'center',
		alignContent:'center'
	},
	textInput1: {
		height: 40,
		width: 120,
		borderColor: '#000000',
		borderBottomWidth: 1,
		fontSize: 17,
		marginEnd:30
	},
	textInput2: {
		height: 40,
		width: 130,
		borderColor: '#000000',
		borderBottomWidth: 1,
		fontSize: 17
	},
	textInput3: {
		height: 40,
		width: 280,
		borderColor: '#000000',
		borderBottomWidth: 1,
		alignSelf:'center',
		fontSize: 17
	},
	btnContainer: {
		width:150,
		alignSelf:'center',
		backgroundColor: 'white',
		marginTop: 12,
	},
});
  


export default SignUp;
