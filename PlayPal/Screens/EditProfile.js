import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    Text,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import cityData from '../Assets/cityData.json';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import sportsList from '../Assets/sportsList.json';
import {StackActions} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import {Avatar} from 'react-native-paper';
import Toast from 'react-native-toast-message';

const EditProfile = ({navigation, route}) => {
    const {
        firstName,
        lastName,
        phone,
        area,
        bio,
        city,
        preferredSports,
        profilePic,
    } = route.params.user;

    const [selectedSports, setSelectedSports] = useState(preferredSports);
    const [imageSelected, setImageSelected] = useState(profilePic);
    const [bioAndInterest, setBioAndInterest] = useState(bio);
    const [isFocus, setIsFocus] = useState(false);
    const [contact, setContact] = useState(phone);

    const cityList = cityData.map(item => ({
        label: item.city,
        value: item.city,
    }));

    const [selectedCity, setSelectedCity] = useState(city);
    const [areaName, setAreaName] = useState(area);
    const [isLoading, setIsLoading] = useState(false);

    const UpdateProfile = async () => {
        const userData = {
            profilePic: imageSelected,
            city: selectedCity,
            area: areaName,
            bio: bioAndInterest,
            preferredSports: selectedSports,
        };

        let uid = auth().currentUser.uid;

        if (
            selectedCity === '' ||
            contact === '' ||
            areaName === '' ||
            bioAndInterest === '' ||
            selectedSports.length === 0
        ) {
            Toast.show({
                type: 'error',
                text2: 'Please fill/select all fields',
            });
            return;
        }

        try {
            setIsLoading(true);

            let imageUri = imageSelected;

            // Upload the image to Firebase Storage
            if (imageUri !== route.params.user.profilePic) {
                // Image has changed, so upload it

                imageUri = await uploadImage(uid, imageUri);
            }
            // Add the image URL to the user data
            userData.profilePic = imageUri;

            // Update user data in Firestore
            await firestore().collection('users').doc(uid).update(userData);

            Toast.show({
                type: 'success',
                text1: 'Your profile updated successfully!',
            });

            navigation.goBack();

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);

            Toast.show({
                type: 'error',
                text1: 'Error updating profile!',
                text2: error.message,
            });
        }
    };

    const uploadImage = async (userId, imageUri) => {
        const storageRef = storage().ref(`profile_images/${userId}`);
        const task = storageRef.putFile(imageUri);

        // Wait for the upload to complete
        await task;

        // Get the download URL of the uploaded image
        const downloadURL = await storageRef.getDownloadURL();

        return downloadURL;
    };

    const openImagePicker = async () => {
        try {
            const image = await ImagePicker.openPicker({
                mediaType: 'photo',
                cropping: true,
            });

            if (!image.didCancel && image.path) {
                setImageSelected(image.path);
            } else if (image.didCancel) {
                throw new Error('Image upload cancelled');
            }
        } catch (error) {
            let errorMessage = 'No image selected. Please try again.';

            // Check specific error conditions and update error message accordingly
            if (error.message === 'Image upload cancelled') {
                errorMessage = 'Image upload cancelled.';
            } else if (error.message.includes('file type')) {
                errorMessage = 'The selected file type is not supported.';
            } else if (error.message.includes('file size')) {
                errorMessage = 'The selected file size is too large.';
            }
            if (!imageSelected) {
                Toast.show({
                    type: 'error',
                    text2: errorMessage,
                });
            }
        }
    };

    const handleSportSelection = sportId => {
        // Check if the sport is already selected
        if (selectedSports.includes(sportId)) {
            setSelectedSports(
                selectedSports.filter(sport => sport !== sportId),
            );
        } else {
            setSelectedSports([...selectedSports, sportId]);
        }
    };

    const isSportSelected = sportId => {
        return selectedSports.includes(sportId);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.dpView}>
                    <TouchableOpacity onPress={() => openImagePicker()}>
                        {imageSelected ? (
                            <Avatar.Image
                                size={130}
                                source={{uri: imageSelected}}
                                style={styles.dpImage1}
                            />
                        ) : (
                            <Image
                                source={require('../Assets/Icons/profilePic.png')}
                                style={styles.dpImage2}
                            />
                        )}

                        <Image
                            source={require('../Assets/Icons/pencil.png')}
                            style={styles.pencilImg}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.nameTxt}>{`${firstName} ${lastName}`}</Text>

                <View style={styles.dropView}>
                    <Text style={styles.dropLabel}>Your city:</Text>
                    <Dropdown
                        style={styles.dropdown}
                        selectedTextStyle={styles.selectedTextStyle}
                        containerStyle={styles.dropContainer}
                        itemTextStyle={styles.dropItemText}
                        itemContainerStyle={styles.dropItem}
                        iconStyle={styles.iconStyle}
                        inputSearchStyle={styles.dropSearch}
                        data={cityList}
                        maxHeight={250}
                        labelField="label"
                        search={true}
                        valueField="value"
                        placeholder={!isFocus ? 'Select city' : '...'}
                        searchPlaceholder={'Search here...'}
                        searchField=""
                        value={selectedCity}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setSelectedCity(item.value);
                            setIsFocus(false);
                        }}
                    />
                </View>

                <View style={styles.inputView}>
                    <Text style={styles.text1}>Your area:</Text>
                    <TextInput
                        placeholder="write area name here"
                        placeholderTextColor={'darkgrey'}
                        style={styles.textInput2}
                        maxLength={30}
                        color={'lightgrey'}
                        defaultValue={areaName}
                        onChangeText={text => setAreaName(text.trim())}
                    />
                </View>

                <View style={styles.inputView}>
                    <Text style={styles.text1}>Your phone:</Text>
                    <TextInput
                        placeholder="Phone# 03XXXXXXXXX"
                        placeholderTextColor={'darkgrey'}
                        style={styles.textInput2}
                        maxLength={30}
                        color={'lightgrey'}
                        defaultValue={contact}
                        onChangeText={text => setContact(text.trim())}
                    />
                </View>

                <View style={styles.inputView}>
                    <Text style={styles.text1}>Bio & Interests:</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        maxLength={200}
                        style={styles.textInput}
                        color={'lightgrey'}
                        textAlignVertical="top"
                        defaultValue={bioAndInterest}
                        onChangeText={text => setBioAndInterest(text.trim())}
                    />
                </View>

                <View style={styles.container2}>
                    <Text style={styles.text2}>
                        Select your sports interest:
                    </Text>
                    {Object.keys(sportsList).map(sportId => (
                        <TouchableOpacity
                            key={sportId}
                            style={[
                                styles.option,
                                isSportSelected(sportId) &&
                                    styles.optionSelected,
                            ]}
                            onPress={() => handleSportSelection(sportId)}>
                            <Text
                                style={[
                                    styles.optionText,
                                    isSportSelected(sportId) &&
                                        styles.optionTextSelected,
                                ]}>
                                {sportsList[sportId].name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{marginTop: 40, marginBottom: 50}}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <TouchableOpacity
                            onPress={() => UpdateProfile()}
                            style={styles.btnView}>
                            <Text style={styles.btnText}>Update</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#041e38',
    },
    dpView: {
        width: 120,
        alignSelf: 'center',
        marginTop: 40,
    },
    dpImage1: {
        alignSelf: 'center',
    },
    dpImage2: {
        width: 110,
        height: 110,
        borderRadius: 15,
        alignSelf: 'center',
    },
    pencilImg: {
        width: 30,
        height: 40,
        marginTop: -30,
        alignSelf: 'flex-end',
    },
    nameTxt: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginTop: 20,
        marginBottom: 20,
        textTransform: 'capitalize',
        letterSpacing: 1,
    },
    profileTxt: {
        fontSize: 22,
        textAlign: 'center',
        color: 'white',
        marginTop: 60,
    },
    inputView: {
        marginTop: 30,
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
    },
    textInput: {
        height: 100,
        width: 290,
        borderBottomColor: 'white',
        marginTop: 10,
        borderBottomWidth: 1,
        alignSelf: 'center',
        fontSize: 17,
        paddingLeft: 10,
        backgroundColor: '#143B63',
    },
    text1: {
        height: 30,
        fontSize: 18,
        color: 'white',
    },
    text2: {
        height: 40,
        fontSize: 18,
        alignSelf: 'flex-start',
        marginTop: 30,
        left: 5,
        color: 'white',
    },
    text3: {
        height: 40,
        fontSize: 18,
        alignSelf: 'flex-start',
        marginTop: 25,
        color: 'white',
    },
    textInput2: {
        height: 50,
        width: 290,
        borderBottomColor: 'white',
        marginTop: 10,
        borderBottomWidth: 1,
        alignSelf: 'center',
        fontSize: 17,
        paddingLeft: 10,
        backgroundColor: '#143B63',
    },
    container2: {
        width: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignSelf: 'center',
    },
    option: {
        padding: 10,
        paddingHorizontal: 15,
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
        width: 100,
        height: 100,
    },
    dropView: {
        alignSelf: 'center',
        marginTop: 20,
    },
    dropdown: {
        height: 50,
        width: 290,
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: '#143B63',
    },
    dropLabel: {
        fontSize: 18,
        color: 'white',
        marginBottom: 15,
    },
    dropContainer: {
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'lightgrey',
    },
    selectedTextStyle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#11867F',
    },
    iconStyle: {
        width: 25,
        height: 25,
        tintColor: 'white',
    },
    dropItemText: {
        height: 22,
        color: 'black',
    },
    dropItem: {
        height: 45,
        justifyContent: 'center',
    },
    dropSearch: {
        height: 40,
        fontSize: 16,
        borderColor: 'black',
        color: 'grey',
    },
    btnView: {
        width: 140,
        height: 50,
        borderRadius: 12,
        borderWidth: 4,
        borderColor: '#143B63',
        backgroundColor: '#0c1833',
        alignSelf: 'center',
    },
    btnText: {
        textAlign: 'center',
        padding: 8,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 1,
    },
});

export default EditProfile;
