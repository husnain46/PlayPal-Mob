import React, {useRef, useState, useEffect} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from 'react-native';
import {Button, IconButton, TextInput} from 'react-native-paper';
import AlertPro from 'react-native-alert-pro';
import ImagePicker from 'react-native-image-crop-picker';
import {Dropdown} from 'react-native-element-dropdown';
import firestore from '@react-native-firebase/firestore';
import cityData from '../Assets/cityData.json';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import {Divider} from '@rneui/themed';
import {de} from 'date-fns/locale';

const EditTeam = ({navigation, route}) => {
    const {myTeam, playersList} = route.params;

    const [teamName, setTeamName] = useState(myTeam.name);
    const [teamDetail, setTeamDetail] = useState(myTeam.description);
    const [imageSelected, setImageSelected] = useState(myTeam.teamPic);
    const [selectedCaptain, setSelectedCaptain] = useState(myTeam.captainId);
    const [teamCity, setTeamCity] = useState(myTeam.city);
    const [isFocus, setIsFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [playersData, setPlayersData] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [hasPlayed, setHasPlayed] = useState(false);

    const cityList = cityData.map(item => ({
        label: item.city,
        value: item.city,
    }));

    useEffect(() => {
        const fetchPlayersData = () => {
            try {
                const initialPlayersData = myTeam.playersId
                    .map(pId => {
                        const player = playersList.find(
                            player => player.id === pId,
                        );
                        if (player) {
                            return {
                                label: `${player.firstName} ${player.lastName}`,
                                value: pId,
                            };
                        } else {
                            return null;
                        }
                    })
                    .filter(player => player !== null);
                setPlayersData(initialPlayersData);
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Error loading players data',
                    text2: error.message,
                });
            } finally {
                setListLoading(false);
            }
        };

        const checkTournaments = async () => {
            try {
                const tournamentSnap = await firestore()
                    .collection('tournaments')
                    .where('teamIds', 'array-contains', myTeam.teamId)
                    .get();

                if (!tournamentSnap.empty) {
                    setHasPlayed(true);
                }
            } catch (error) {
                console.log(error);
            }
        };
        checkTournaments();

        fetchPlayersData();
    }, []);

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
        const storageRef = storage().ref(`team_images/${myTeam.teamId}`);
        const task = storageRef.putFile(imageUri);

        // Wait for the upload to complete
        await task;

        // Get the download URL of the uploaded image
        const downloadURL = await storageRef.getDownloadURL();

        return downloadURL;
    };

    const alertRefs = useRef([]);

    const showAlert = index => {
        if (alertRefs.current[index]) {
            alertRefs.current[index].open();
        }
    };

    const handleClose = index => {
        if (alertRefs.current[index]) {
            alertRefs.current[index].close();
        }
    };

    const checkIfCaptain = async playerId => {
        try {
            const teamDoc = await firestore()
                .collection('teams')
                .where('captainId', '==', playerId)
                .get();

            if (teamDoc.empty) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text2: 'An unexpected error occurred!',
            });
        }
    };

    const renderAlert = (pId, pName, index) => {
        return (
            <AlertPro
                ref={ref => (alertRefs.current[index] = ref)}
                title={''}
                message={`Do want to remove ${pName} from this team?`}
                onCancel={() => handleClose(index)}
                textCancel="No"
                textConfirm="Yes"
                onConfirm={() => confirmDelete(pId, index)}
                customStyles={{
                    message: {marginTop: -20, marginBottom: 10},
                }}
            />
        );
    };

    const confirmDelete = (pId, index) => {
        const arrayIndex = playersData.findIndex(
            player => player.value === pId,
        );
        alertRefs.current[index].close();

        if (arrayIndex !== -1) {
            const updatedPlayersData = [...playersData];
            updatedPlayersData.splice(arrayIndex, 1);
            setPlayersData(updatedPlayersData);
        }
    };

    const handleCaptainChange = async () => {
        if (selectedCaptain === myTeam.captainId) {
            console.log('s');
            updateTeam();
        } else {
            const isCap = await checkIfCaptain(selectedCaptain);
            if (isCap) {
                Toast.show({
                    type: 'error',
                    text1: 'Select some other captain',
                    text2: 'The Selected captain is already a captain.',
                });
            } else {
                updateTeam();
            }
        }
    };

    const updateTeam = async () => {
        setLoading(true);

        try {
            let imageUri = imageSelected;
            if (
                !imageUri.startsWith('https://firebasestorage.googleapis.com')
            ) {
                imageUri = await uploadImage(imageSelected);
            }

            const updatedPlayers = playersData.map(item => item.value);

            const teamData = {
                name: teamName,
                description: teamDetail,
                teamPic: imageUri,
                city: teamCity,
                captainId: selectedCaptain,
                playersId: updatedPlayers,
            };

            await firestore()
                .collection('teams')
                .doc(myTeam.teamId)
                .update(teamData);

            navigation.navigate('BottomTab', {screen: 'Team'});

            Toast.show({
                type: 'success',
                text1: 'Team updated successfully!',
            });

            setLoading(false);
        } catch (error) {
            setLoading(false);

            Toast.show({
                type: 'error',
                text1: 'Error updating data!',
                text2: error.message,
            });
        }
    };

    const deleteAlertRef = useRef([]);
    const clashAlertRef = useRef([]);

    const handleDeleteTeam = async () => {
        try {
            deleteAlertRef.current.close();
            setLoading(true);

            await firestore().collection('teams').doc(myTeam.teamId).delete();

            navigation.navigate('BottomTab', {screen: 'Team'});

            Toast.show({
                type: 'success',
                text1: `Your team ${myTeam.name} is deleted!`,
            });

            setLoading(false);
        } catch (error) {
            setLoading(false);

            Toast.show({
                type: 'error',
                text1: 'Error deleting team!',
                text2: error.message,
            });
        }
    };

    const renderItem = ({item, index}) => {
        const num = index + 1;
        return (
            <View style={styles.teamCard}>
                <Text style={styles.teamName}>{`${num})  ${item.label}`}</Text>
                {item.value === myTeam.captainId ? (
                    <Image
                        source={require('../Assets/Icons/captain.png')}
                        style={{marginRight: 14}}
                    />
                ) : (
                    <IconButton
                        icon="close-circle"
                        iconColor={'#B95252'}
                        size={28}
                        style={styles.removeIcon}
                        onPress={() => showAlert(index)}
                    />
                )}
                {renderAlert(item.value, item.label, index)}
            </View>
        );
    };

    if (listLoading) {
        return (
            <ActivityIndicator
                size="large"
                color="#0000ff"
                animating={listLoading}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                style={{width: '100%'}}>
                <View style={styles.titleView}>
                    <Text style={styles.titleScreen}>Edit Team</Text>
                    <Button
                        mode="contained"
                        style={styles.saveBtn}
                        buttonColor="#11ab7a"
                        onPress={() => handleCaptainChange()}>
                        <Text style={styles.saveText}>Save</Text>
                    </Button>
                </View>

                <Divider style={styles.divider} width={1} color="grey" />

                <View style={styles.inputView1}>
                    <Text style={styles.labelText}>Team name:</Text>

                    <TextInput
                        style={styles.textInput1}
                        outlineStyle={styles.inputOutline}
                        contentStyle={styles.inputText}
                        mode="outlined"
                        value={teamName}
                        onChangeText={text => setTeamName(text)}
                        outlineColor="black"
                    />
                </View>

                <View style={{marginTop: 20}}>
                    <Text style={styles.labelText}>Team detail:</Text>
                    <TextInput
                        multiline={true}
                        mode="outlined"
                        numberOfLines={4}
                        value={teamDetail}
                        onChangeText={text => setTeamDetail(text)}
                        style={styles.detailInput}
                        outlineStyle={styles.inputOutline}
                        outlineColor="black"
                    />
                </View>

                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={loading}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                                animating={loading}
                            />
                        </View>
                    </View>
                </Modal>

                <AlertPro
                    ref={ref => (clashAlertRef.current = ref)}
                    title={''}
                    message={
                        'Your team is in a tournament right now. You cannot delete this team!'
                    }
                    showCancel={false}
                    textConfirm="Ok"
                    onConfirm={() => clashAlertRef.current.close()}
                    customStyles={{
                        message: {marginTop: -20, marginBottom: 10},
                    }}
                />

                <AlertPro
                    ref={ref => (deleteAlertRef.current = ref)}
                    title={'Delete team?'}
                    message={'Are you sure you want to delete this team?'}
                    onCancel={() => deleteAlertRef.current.close()}
                    textCancel={'No'}
                    onConfirm={() => handleDeleteTeam()}
                    textConfirm="Yes"
                    customStyles={{
                        buttonConfirm: {backgroundColor: 'red'},
                        buttonCancel: {backgroundColor: '#64bbde'},
                        container: {borderWidth: 2, borderColor: 'grey'},
                        message: {fontSize: 16},
                    }}
                />

                <View style={{width: 300, marginTop: 20}}>
                    <Text style={styles.labelText}>Team photo:</Text>
                    <TouchableOpacity
                        style={styles.imageView}
                        onPress={() => openImagePicker()}>
                        {imageSelected ? (
                            <Image
                                style={styles.teamImage}
                                source={{uri: imageSelected}}
                            />
                        ) : (
                            <Image
                                style={styles.pickImage}
                                source={require('../Assets/Icons/photo.png')}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.dropView}>
                    <Text style={styles.dropLabel}>City:</Text>
                    <Dropdown
                        style={styles.dropdown}
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
                        defaultValue={teamCity}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setTeamCity(item.value);
                            setIsFocus(false);
                        }}
                    />
                </View>

                <View style={styles.dropView}>
                    <Text style={styles.dropLabel}>Captain:</Text>
                    <Dropdown
                        style={styles.dropdown}
                        selectedTextStyle={styles.selectedTextStyle}
                        containerStyle={styles.dropContainer}
                        iconStyle={styles.iconStyle}
                        itemTextStyle={{color: 'black'}}
                        data={playersData}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={'Select Captain'}
                        value={selectedCaptain}
                        onChange={item => setSelectedCaptain(item.value)}
                    />
                </View>

                <View style={{marginTop: 20, width: 300}}>
                    <Text style={styles.teamLabel}>Players:</Text>
                </View>

                <FlatList
                    data={playersData}
                    renderItem={renderItem}
                    keyExtractor={item => item.value}
                    scrollEnabled={false}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                    }}
                />

                <View style={styles.deleteView}>
                    <Button
                        style={{borderRadius: 10}}
                        mode="contained"
                        disabled={hasPlayed}
                        buttonColor="red"
                        onPress={() => deleteAlertRef.current.open()}>
                        <Text style={styles.deletText}>Delete team</Text>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    activityIndicatorWrapper: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    scrollView: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    titleView: {
        width: '90%',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleScreen: {
        fontSize: 22,
        fontWeight: '600',
        color: '#4a5a96',
    },
    saveBtn: {
        borderRadius: 10,
        height: 35,
    },
    saveText: {
        fontSize: 17,
        color: 'white',
        fontWeight: '600',
        marginTop: 7,
    },
    divider: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 10,
        marginBottom: 30,
    },
    inputView1: {
        marginVertical: 5,
    },
    textInput1: {
        width: 300,
        height: 50,
        backgroundColor: 'white',
    },
    inputOutline: {
        borderRadius: 10,
    },
    inputText: {
        fontSize: 17,
        height: 55,
    },
    labelText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '500',
        color: 'black',
    },
    detailInput: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
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
        width: 100,
        height: 90,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
    },
    dropView: {
        width: 300,
        marginTop: 20,
    },
    dropdown: {
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
        fontSize: 14,
        borderColor: 'black',
        color: 'black',
    },
    teamLabel: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '500',
        color: 'black',
    },
    teamCard: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'lightgrey',
        marginBottom: 10,
        height: 55,
        alignSelf: 'center',
        alignItems: 'center',
        width: 300,
        justifyContent: 'space-between',
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
    },
    teamName: {
        fontSize: 17,
        color: 'black',
        paddingHorizontal: 10,
    },
    removeIcon: {
        marginRight: 5,
    },
    deleteView: {
        marginTop: 40,
        width: 200,
        height: 50,
        alignItems: 'center',
    },
    deletText: {
        fontSize: 17,
        color: 'white',
        fontWeight: '600',
    },
});
export default EditTeam;
