import React, {useState} from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    Text,
    Alert,
    ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import cityData from '../Assets/cityData.json';
import styles from '../Styles/welcomeStyles';

const Welcome = ({navigation, route}) => {
    const [selectedSports, setSelectedSports] = useState([]);
    const [nextBool, setNextBool] = useState(false);
    const [imageSelected, setImageSelected] = useState('');
    const [skillLevel, setSkillLevel] = useState(null);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

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

    const profileStatus = route.params;

    const skLvl = [
        {label: 'Beginner', value: 'lvl1'},
        {label: 'Amateur', value: 'lvl2'},
        {label: 'Professional', value: 'lvl3'},
    ];

    const handleSkillChange = itemValue => {
        setSkillLevel(itemValue);
    };

    const gotoHome = () => {
        navigation.navigate('BottomTab');
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
            console.log(error); // Log the error for debugging purposes

            let errorMessage = 'Failed to upload the image. Please try again.';

            // Check specific error conditions and update error message accordingly
            if (error.message === 'Image upload cancelled') {
                errorMessage = 'Image upload cancelled.';
            } else if (error.message.includes('file type')) {
                errorMessage = 'The selected file type is not supported.';
            } else if (error.message.includes('file size')) {
                errorMessage = 'The selected file size is too large.';
            }

            Alert.alert('Error', errorMessage);
        }
    };

    const sportsOptions = [
        {id: '1', name: 'Football'},
        {id: '2', name: 'Cricket'},
        {id: '3', name: 'Tennis'},
        {id: '4', name: 'Basketball'},
        {id: '5', name: 'Table Tennis'},
        {id: '6', name: 'Hockey'},
        {id: '7', name: 'Bedminton'},
        {id: '8', name: 'Volleyball'},
    ];

    const handleSportSelection = sport => {
        const index = selectedSports.findIndex(item => item.id === sport.id);
        if (index > -1) {
            setSelectedSports(prevSelected => {
                const updatedSelected = [...prevSelected];
                updatedSelected.splice(index, 1);
                return updatedSelected;
            });
        } else {
            setSelectedSports(prevSelected => [...prevSelected, sport]);
        }
    };

    const isSportSelected = sport =>
        selectedSports.some(item => item.id === sport.id);

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
                <Text style={styles.nameTxt}>Husnain Ahmed</Text>
                <View style={styles.inputView}>
                    <Text style={styles.text1}>Enter your bio:</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={3}
                        style={styles.textInput}
                        color={'white'}
                        textAlignVertical="top"
                    />
                </View>

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

                <View style={styles.container2}>
                    <Text style={styles.text2}>
                        Select your sports interest:
                    </Text>
                    {sportsOptions.map(sport => (
                        <TouchableOpacity
                            key={sport.id}
                            style={[
                                styles.option,
                                isSportSelected(sport) && styles.optionSelected,
                            ]}
                            onPress={() => handleSportSelection(sport)}>
                            <Text
                                style={[
                                    styles.optionText,
                                    isSportSelected(sport) &&
                                        styles.optionTextSelected,
                                ]}>
                                {sport.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.pickerView}>
                    <Text style={styles.text3}>Your skills level:</Text>
                    <View style={styles.pickerStyle}>
                        <Picker
                            style={{width: 290}}
                            selectedValue={skillLevel}
                            onValueChange={handleSkillChange}
                            mode="dropdown"
                            dropdownIconColor={'white'}
                            dropdownIconRippleColor={'#11867F'}>
                            <Picker.Item
                                style={styles.pickerBox}
                                label="Select skill level"
                                value=""
                                enabled={false}
                                color="#11867F"
                            />
                            {skLvl.map((lvl, index) => (
                                <Picker.Item
                                    style={styles.pickerBox}
                                    color="white"
                                    key={index}
                                    label={lvl.label}
                                    value={lvl.value}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.btnView}>
                    <TouchableOpacity onPress={() => gotoHome()}>
                        <Text style={styles.btnText}>Finish</Text>
                    </TouchableOpacity>
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

                    <Text style={styles.nameTxt}>Welcome Husnain</Text>
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
