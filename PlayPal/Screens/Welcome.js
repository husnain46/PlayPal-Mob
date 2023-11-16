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
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import cityData from '../Assets/cityData.json';
import styles from '../Styles/welcomeStyles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import sportsList from '../Assets/sportsList.json';
import {StackActions} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Welcome = ({navigation}) => {
    const [selectedSports, setSelectedSports] = useState([]);
    const [nextBool, setNextBool] = useState(false);
    const [imageSelected, setImageSelected] = useState('');
    const [bio, setBio] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [area, setArea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [userFirstName, setUserFirstName] = useState('');

    const fetchUserName = async uid => {
        try {
            const userRef = firestore().collection('users').doc(uid);
            const userDoc = await userRef.get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const {firstName, lastName} = userData;
                setPlayerName(`${firstName} ${lastName}`);
                setUserFirstName(firstName);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error loading user data!',
                text2: error.message,
            });
        }
    };

    useEffect(() => {
        const uid = auth().currentUser.uid;
        if (uid) {
            fetchUserName(uid);
        }
    }, []);

    const provinces = [
        {label: 'Punjab', value: 'Punjab'},
        {label: 'Sindh', value: 'Sindh'},
        {
            label: 'Islamabad Capital Territory',
            value: 'Islamabad Capital Territory',
        },
        {label: 'Khyber Pakhtunkhwa', value: 'Khyber Pakhtunkhwa'},
        {label: 'Balochistan', value: 'Balochistan'},
        {label: 'Gilgit-Baltistan', value: 'Gilgit-Baltistan'},
        {label: 'Azad Kashmir', value: 'Azad Kashmir'},
    ];

    const handleProvinceChange = itemValue => {
        setSelectedProvince(itemValue);

        const filteredCities = cityData.filter(
            city => city.province === itemValue,
        );
        setCities(filteredCities);
        setSelectedCity('');
    };

    const handleCityChange = itemValue => {
        setSelectedCity(itemValue);
    };

    const finishProfile = async () => {
        const userData = {
            city: selectedCity,
            area,
            bio,
            preferredSports: selectedSports,
        };

        let uid = auth().currentUser.uid;

        if (
            !selectedCity ||
            !area ||
            !bio ||
            !selectedSports ||
            !imageSelected
        ) {
            Toast.show({
                type: 'error',
                text1: 'Please fill/select all the fields!',
            });
            return;
        }

        try {
            setIsLoading(true);

            // Upload the image to Firebase Storage
            const imageUri = await uploadImage(uid, imageSelected);
            // Add the image URL to the user data
            userData.profilePic = imageUri;

            // Update user data in Firestore
            await firestore().collection('users').doc(uid).update(userData);

            Toast.show({
                type: 'success',
                text1: 'Profile completed!',
            });

            navigation.dispatch(StackActions.replace('BottomTab'));
        } catch (error) {
            setIsLoading(false);
            Toast.show({
                type: 'error',
                text1: 'An error occurred!',
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
                console.log(imageSelected);
            } else if (image.didCancel) {
                throw new Error('Image upload cancelled');
            }
        } catch (error) {
            let errorMessage = 'Failed to upload the image. Please try again.';

            // Check specific error conditions and update error message accordingly
            if (error.message === 'Image upload cancelled') {
                errorMessage = 'Image upload cancelled.';
            } else if (error.message.includes('file type')) {
                errorMessage = 'The selected file type is not supported.';
            } else if (error.message.includes('file size')) {
                errorMessage = 'The selected file size is too large.';
            }

            Toast.show({
                type: 'error',
                text1: 'Error loading user data!',
                text2: errorMessage,
            });
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

    const nextPanel = () => {
        return (
            <ScrollView>
                <View style={styles.dpView}>
                    <TouchableOpacity onPress={() => openImagePicker()}>
                        {imageSelected ? (
                            <Image
                                source={{uri: imageSelected}}
                                style={styles.dpImage2}
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
                <Text style={styles.nameTxt}>{playerName}</Text>

                <View style={styles.pickerView}>
                    <Text style={styles.text3}>Your province:</Text>
                    <View style={styles.pickerStyle}>
                        <Picker
                            style={{width: 290}}
                            selectedValue={selectedProvince}
                            onValueChange={handleProvinceChange}
                            mode="dropdown"
                            dropdownIconColor={'white'}
                            dropdownIconRippleColor={'#11867F'}>
                            <Picker.Item
                                style={styles.pickerBox}
                                label="Select your province"
                                value=""
                                enabled={false}
                                color="#11867F"
                            />
                            {provinces.map((province, index) => (
                                <Picker.Item
                                    style={styles.pickerBox}
                                    color="white"
                                    key={index}
                                    label={province.label}
                                    value={province.value}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.pickerView}>
                    <Text style={styles.text3}>Your city:</Text>
                    <View style={styles.pickerStyle}>
                        <Picker
                            style={{width: 290}}
                            selectedValue={selectedCity}
                            onValueChange={handleCityChange}
                            mode="dropdown"
                            enabled={selectedProvince !== '' ? true : false}
                            dropdownIconColor={'white'}
                            dropdownIconRippleColor={'#11867F'}>
                            <Picker.Item
                                style={styles.pickerBox}
                                label="Select your city"
                                value=""
                                enabled={false}
                                color="#11867F"
                            />
                            {cities.map((city, index) => (
                                <Picker.Item
                                    key={index}
                                    style={styles.pickerBox}
                                    label={city.city}
                                    value={city.city}
                                    color={
                                        city.id === null ? '#11867F' : 'white'
                                    }
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputView}>
                    <Text style={styles.text1}>Your area:</Text>
                    <TextInput
                        placeholder="write area name here"
                        placeholderTextColor={'darkgrey'}
                        style={styles.textInput2}
                        maxLength={30}
                        color={'white'}
                        onChangeText={text => setArea(text.trim())}
                    />
                </View>

                <View style={styles.inputView}>
                    <Text style={styles.text1}>Enter your bio:</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={3}
                        maxLength={200}
                        style={styles.textInput}
                        color={'white'}
                        textAlignVertical="top"
                        onChangeText={text => setBio(text.trim())}
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
                            onPress={() => finishProfile()}
                            style={styles.btnView}>
                            <Text style={styles.btnText}>Finish</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {nextBool ? (
                nextPanel()
            ) : (
                <View>
                    <Image
                        source={require('../Assets/Icons/profilePic.png')}
                        style={styles.dpImage}
                    />

                    <Text style={styles.nameTxt}>Welcome {userFirstName}</Text>
                    <Text style={styles.profileTxt}>
                        Let's complete your profile first!
                    </Text>

                    <View style={styles.arrowView}>
                        <TouchableOpacity onPress={() => setNextBool(true)}>
                            <Image
                                source={require('../Assets/Icons/rArrow1.png')}
                                style={styles.arrowImg}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Welcome;
