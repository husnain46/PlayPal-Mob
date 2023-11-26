import React, {useState} from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import {Text, Button} from '@rneui/themed';
import {RadioButton, TextInput} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import sportsList from '../Assets/sportsList.json';
import {Dropdown} from 'react-native-element-dropdown';
import cityData from '../Assets/cityData.json';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';
import Toast from 'react-native-toast-message';
import storage from '@react-native-firebase/storage';

const CreateTeam = ({navigation}) => {
    const [teamName, setTeamName] = useState('');
    const [teamDetail, setTeamDetail] = useState('');
    const [sportValue, setSportValue] = useState('');
    const [teamSize, setTeamSize] = useState();
    const [imageSelected, setImageSelected] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [teamCity, setTeamCity] = useState('');
    const [loading, setLoading] = useState(false);

    const cityList = cityData.map(item => ({
        label: item.city,
        value: item.city,
    }));

    const sportsData = Object.keys(sportsList).map(sportId => ({
        label: sportsList[sportId].name,
        value: sportId,
    }));

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
                text1: 'Error',
                text2: errorMessage,
            });
        }
    };

    const uploadImage = async imageUri => {
        const teamId = firestore().collection('teams').doc().id;

        const storageRef = storage().ref(`team_images/${teamId}`);
        const task = storageRef.putFile(imageUri);

        // Wait for the upload to complete
        await task;

        // Get the download URL of the uploaded image
        const downloadURL = await storageRef.getDownloadURL();

        return {downloadURL, teamId};
    };

    const handleCreateTeam = async () => {
        let capId = auth().currentUser.uid;

        const tName = teamName.trim().toLowerCase();

        try {
            setLoading(true);
            // Fetch teams from Firestore
            const teamsQuery = await firestore().collection('teams').get();

            // Check if a team with the same name (case-insensitive) already exists
            const matchName = teamsQuery.docs.find(doc => {
                const tData = doc.data();
                const firestoreTeamName = tData.name.trim().toLowerCase();
                return firestoreTeamName === tName;
            });

            if (matchName) {
                setLoading(false);

                Alert.alert(
                    'Error',
                    'A team with this name already exists! Change your team name and try again.',
                );
            } else if (
                !teamName ||
                !teamDetail ||
                !teamCity ||
                !sportValue ||
                !teamSize ||
                !imageSelected ||
                !capId
            ) {
                setLoading(false);

                Alert.alert('Error', 'Please fill in all fields.');
            } else {
                const {downloadURL, teamId} = await uploadImage(imageSelected);
                // Team with the same name does not exist, create the team
                const teamData = {
                    name: teamName,
                    sportId: sportValue,
                    size: teamSize,
                    city: teamCity,
                    description: teamDetail,
                    teamPic: downloadURL,
                    playersId: [capId],
                    captainId: capId,
                    requests: [],
                    rank: 'Freshies',
                    totalMatch: 0,
                    wins: 0,
                    loses: 0,
                    draws: 0,
                };
                await firestore().collection('teams').doc(teamId).set(teamData);

                setLoading(false);

                Toast.show({
                    type: 'success',
                    text1: `Your team ${teamName} created successfully!`,
                });

                setLoading(false);

                navigation.navigate('BottomTab', {screen: 'Team'});
            }
        } catch (error) {
            setLoading(false);

            Toast.show({
                type: 'error',
                text1: 'Error creating team!',
                text2: error.message,
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{alignItems: 'center'}}>
                <Text h3 style={styles.title}>
                    Create your team
                </Text>
                <View style={{marginTop: 70}}>
                    <TextInput
                        mode="outlined"
                        label="Team name"
                        labelStyle={{color: 'black', bottom: 10, fontSize: 18}}
                        value={teamName}
                        onChangeText={text => setTeamName(text)}
                        style={{backgroundColor: 'white', width: 280}}
                    />
                </View>

                <View style={{marginTop: 30}}>
                    <TextInput
                        multiline={true}
                        mode="outlined"
                        numberOfLines={3}
                        label="Description"
                        labelStyle={{color: 'black', bottom: 10, fontSize: 18}}
                        value={teamDetail}
                        onChangeText={text => setTeamDetail(text)}
                        style={{backgroundColor: 'white', width: 280}}
                    />
                </View>

                <View style={styles.dropView}>
                    <Text style={styles.dropLabel}>City:</Text>
                    <Dropdown
                        style={styles.dropdown1}
                        selectedTextStyle={styles.selectedTextStyle}
                        containerStyle={styles.dropContainer}
                        itemTextStyle={styles.dropItemText}
                        itemContainerStyle={styles.dropItem}
                        iconStyle={styles.iconStyle}
                        inputSearchStyle={styles.dropSearch}
                        data={cityList}
                        maxHeight={200}
                        labelField="label"
                        search={true}
                        valueField="value"
                        placeholder={!isFocus ? 'Select city' : '...'}
                        searchPlaceholder={'Search...'}
                        searchField=""
                        value={teamCity}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setTeamCity(item.value);
                            setIsFocus(false);
                        }}
                    />
                </View>

                <View style={styles.dropView}>
                    <Text style={styles.dropLabel}>Team sport:</Text>
                    <Dropdown
                        style={styles.dropdown2}
                        selectedTextStyle={styles.selectedTextStyle}
                        containerStyle={styles.dropContainer}
                        iconStyle={styles.iconStyle}
                        data={sportsData}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={'Select sports'}
                        value={sportValue}
                        onChange={item => setSportValue(item.value)}
                    />
                </View>

                {sportValue ? (
                    <View style={{width: 280}}>
                        <Text style={styles.subtitle}>Default team size</Text>

                        <RadioButton.Group
                            onValueChange={newValue => setTeamSize(newValue)}
                            value={teamSize}>
                            <View style={styles.radioView}>
                                {sportsList[sportValue].size.map(option => (
                                    <View key={option} style={styles.radioView}>
                                        <Text style={styles.radioText}>
                                            {option} vs {option}
                                        </Text>
                                        <RadioButton value={option} />
                                    </View>
                                ))}
                            </View>
                        </RadioButton.Group>
                    </View>
                ) : (
                    <View style={{width: 280}}></View>
                )}

                <View style={{width: 280}}>
                    <Text style={styles.subtitle}>Upload team photo:</Text>
                    <TouchableOpacity
                        style={styles.imageView}
                        onPress={() => openImagePicker()}>
                        {imageSelected ? (
                            <Image
                                style={styles.teamImage}
                                source={{uri: imageSelected}}
                                resizeMode="contain"
                            />
                        ) : (
                            <Image
                                style={styles.pickImage}
                                source={require('../Assets/Icons/photo.png')}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        alignItems: 'center',
                        marginBottom: 30,
                        marginTop: 50,
                    }}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <Button
                            title="Create"
                            onPress={handleCreateTeam}
                            buttonStyle={styles.createButton}
                            titleStyle={{fontSize: 18}}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        marginTop: 20,
        color: '#4a5a96',
        textAlign: 'center',
        left: -5,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 30,
    },
    createButton: {
        width: 120,
        backgroundColor: '#189863',
        borderRadius: 10,
    },
    radioView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
        marginEnd: 30,
        left: 5,
    },
    radioText: {
        fontSize: 17,
        textAlign: 'right',
    },
    pickerBox: {
        fontSize: 16,
    },
    pickerStyle: {
        width: 200,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'grey',
        marginTop: 10,
        backgroundColor: 'white',
    },
    pickerLabel: {
        fontSize: 18,
        fontWeight: '700',
    },
    dropView: {
        width: 280,
        marginTop: 20,
    },
    dropdown1: {
        height: 50,
        width: 260,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
    },
    dropdown2: {
        height: 50,
        width: 260,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
    },
    dropLabel: {
        fontSize: 17,
        fontWeight: '700',
        color: 'black',
        marginBottom: 10,
    },
    dropContainer: {
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'grey',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#11867F',
    },
    iconStyle: {
        width: 25,
        height: 25,
        tintColor: 'black',
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
    },
    imageView: {
        width: 82,
        height: 82,
        alignItems: 'center',
        marginTop: 15,
        margin: 10,
    },
    pickImage: {
        width: 80,
        height: 80,
    },
    teamImage: {
        width: 80,
        height: 80,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
    },
});

export default CreateTeam;
