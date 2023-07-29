import React, {useState} from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    Text,
    Alert,
    ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DropDownPicker from 'react-native-dropdown-picker';

const Welcome = ({navigation, route}) => {
    const [selectedSports, setSelectedSports] = useState([]);
    const [nextBool, setNextBool] = useState(false);
    const [imageSelected, setImageSelected] = useState('');
    const [skillLevel, setSkillLevel] = useState(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const profileStatus = route.params;
    const skLvl = [
        {label: 'Beginner', value: 'lvl1'},
        {label: 'Amateur', value: 'lvl2'},
        {label: 'Professional', value: 'lvl3'},
    ];

    const gotoHome = () => {
        navigation.setParams({profileStatus: true});
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

                <Text style={styles.text2}>Select your sports interest:</Text>

                <View style={styles.container2}>
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

                <View style={styles.dropView}>
                    <Text style={styles.text3}>Select your skill level:</Text>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={skLvl}
                        setOpen={setOpen}
                        setValue={setValue}
                        placeholder="Select skill level"
                        style={styles.dropBox}
                        dropDownContainerStyle={{
                            backgroundColor: '#143B63',
                            borderBottomWidth: 1,
                            borderTopWidth: 5,
                            borderWidth: 0,
                        }}
                        onChangeItem={item => setSkillLevel(item.value)}
                        listMode="SCROLLVIEW"
                        textStyle={{color: 'white', fontSize: 16}}
                        arrowIconStyle={{tintColor: 'white'}}
                        tickIconStyle={{tintColor: 'white'}}
                    />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#041e38',
    },
    dpImage: {
        width: 170,
        height: 115,
        alignSelf: 'center',
        marginTop: 80,
    },
    dpView: {
        width: 120,
        alignSelf: 'center',
        marginTop: 40,
    },
    dpImage2: {
        width: 100,
        height: 115,
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
        width: 280,
        marginTop: 40,
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
    },
    textInput: {
        height: 60,
        width: 280,
        borderBottomColor: 'white',
        marginTop: 10,
        borderBottomWidth: 1,
        alignSelf: 'center',
        fontSize: 17,
        backgroundColor: '#143B63',
    },
    text1: {
        height: 30,
        alignSelf: 'flex-start',
        fontSize: 18,
        color: 'white',
    },
    text2: {
        height: 40,
        fontSize: 18,
        marginTop: 30,
        marginLeft: 55,
        color: 'white',
    },
    text3: {
        height: 30,
        alignSelf: 'flex-start',
        fontSize: 18,
        color: 'white',
        margin: 2,
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
        width: 290,
    },
    dropBox: {
        backgroundColor: '#143B63',
        borderWidth: 0,
        marginTop: 5,
    },
    btnView: {
        marginTop: 30,
        width: 140,
        height: 50,
        borderRadius: 12,
        borderWidth: 4,
        borderColor: '#143B63',
        backgroundColor: '#0c1833',
        alignSelf: 'center',
        marginBottom: 50,
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

export default Welcome;
