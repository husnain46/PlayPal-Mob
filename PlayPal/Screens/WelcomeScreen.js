import React, { useState } from 'react';
import { 
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList,
    TextInput,
    Image,
    StyleSheet, 
    Text, 
    ImageBackground, 
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';


const WelcomeScreen = () => {
    
    const [selectedSports, setSelectedSports] = useState([]);
    const [profileStatus, setProfileStatus] = useState(true);
    const [nextBool, setNextBool] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openImagePicker = () => {
        ImagePicker.openPicker({
          mediaType: 'photo',
          cropping: true, // Enable cropping functionality
        }).then((response) => {
          if (!response.didCancel && response.path) {
            setSelectedImage(response.path);
          }
        });
    };
      
    const sportsOptions = [
        { id: '1', name: 'Football' },
        { id: '2', name: 'Cricket' },
        { id: '3', name: 'Tennis' },
        { id: '4', name: 'Basketball' },
        { id: '5', name: 'Table Tennis' },
        { id: '6', name: 'Hockey' },
        { id: '7', name: 'Bedminton' },
        { id: '8', name: 'Volleyball' },

    ];

    const handleSportSelection = (sport) => {
        const index = selectedSports.findIndex((item) => item.id === sport.id);
        if (index > -1) {
            setSelectedSports((prevSelected) => {
            const updatedSelected = [...prevSelected];
            updatedSelected.splice(index, 1);
            return updatedSelected;
            });
        } else {
            setSelectedSports((prevSelected) => [...prevSelected, sport]);
        }
    };

    const isSportSelected = (sport) => selectedSports.some((item) => item.id === sport.id);

    const nextPanel = () => {
        return(
            <ScrollView>
                <View style={styles.dpView}>
                    <TouchableOpacity>
                        
                        <Image 
                            source={require('../Assets/Icons/profilePic.png')}
                            style={styles.dpImage2}
                        />
                        
                        <Image 
                            source={require('../Assets/Icons/pencil.png')}
                            style={styles.pencilImg}
                        />
                            
                    </TouchableOpacity>
                </View>
                <Text style={styles.welcomeTxt}>Husnain Ahmed</Text>
                <View style={styles.inputView}>
                    
                    <Text style={styles.text1}>Enter your bio:</Text>
                    <TextInput 
                        multiline={true}
                        numberOfLines={3} 
                        style={styles.textInput} 
                        color={'white'}
                        textAlignVertical='top'
                    />
                </View>
                
                
                <Text style={styles.text2}>Select your sports interest:</Text>

                <View style={styles.container2}>
                    {sportsOptions.map((sport) => (
                        <TouchableOpacity
                            key={sport.id}
                            style={[styles.option, isSportSelected(sport) && styles.optionSelected]}
                            onPress={() => handleSportSelection(sport)}>

                            <Text style={[styles.optionText, isSportSelected(sport) && styles.optionTextSelected]}>{sport.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        )
    }

    const profileComplete = () => {
        return(
            
            nextBool ? nextPanel() :

            <View>
                <Image source={require('../Assets/Icons/profilePic.png')}
                        style={styles.dpImage}/>

                <Text style={styles.welcomeTxt}>Welcome Husnain</Text>

                <Text style={styles.profileTxt}>Let's complete your profile first!</Text>

            
                <View style={styles.arrowView}>
                    <TouchableOpacity onPress={() => setNextBool(true)}>
                        <Image source={require('../Assets/Icons/rArrow1.png')}
                                style={styles.arrowImg}></Image>
                    </TouchableOpacity>
                </View>

            </View>
                        
        )
    }

    const exploreApp = () => {
        return(
            <View>
                <Text style={{color:'white', fontSize:20}}> new screen</Text>
            </View>
        )
    }
    
    /*
    const loginScreen = () => {
        navigation.navigate('Login');
    };
    */

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.bgImageView}>
                
                {
                    profileStatus ? profileComplete() : exploreApp()
                }
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    
	container: {
        flex: 1,
        backgroundColor: '#041e38'
    },
    dpImage: {
        width:170,
        height:115,
        alignSelf:'center',
        marginTop: 80
    },
    dpView: {
        width:120,
        alignSelf:'center',
        marginTop: 50
    },
    dpImage2: {
        width:100,
        height:115,
        alignSelf:'center',
    },
    pencilImg: {
        width: 30,
        height:40,
        marginTop:-30,
        alignSelf:'flex-end'
    },
    welcomeTxt: {
        fontSize:27,
        fontWeight: 'bold',
        textAlign:'center',
        color: 'white',
        marginTop: 25,
    },
    profileTxt: {
        fontSize:22,
        textAlign:'center',
        color: 'white',
        marginTop: 60,
    },
    inputView: {
        width:280,
        marginTop: 40,
        justifyContent:'center',
        alignContent:'center',
        alignSelf:'center'
    },
    textInput: {
		height: 60,
		width: 280,
		borderBottomColor: 'white',
        marginTop:10,
		borderBottomWidth: 1,
		alignSelf:'center',
		fontSize: 17, 
        backgroundColor:'#143B63',
	},
    text1: {
        height:30,
        alignSelf: 'flex-start',
        fontSize:18,
        color: 'white',
    },
    text2: {
        height:40,
        fontSize:18,
        marginTop:30,
        marginLeft:55,
        color: 'white',
    },
    container2: {
        width:300,
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems: 'center',
        alignSelf:'center'
    },
    option: {
        padding: 10,
        paddingHorizontal:15,
        marginBottom: 10,
        backgroundColor: '#143B63',
        marginHorizontal: 5,
        borderRadius: 15,
    },
    optionSelected: {
        backgroundColor: '#11867F',
    },
    optionText: {
        fontSize: 16,
        color: 'white',
    },
    optionTextSelected: {
        color: 'white',
    },
    arrowView: {
        alignItems: 'center',
        marginTop: 80,
    },
    arrowImg: {
        width:100,
        height:100,
    }

    
});
  


export default WelcomeScreen;