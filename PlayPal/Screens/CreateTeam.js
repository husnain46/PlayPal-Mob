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
import {Text, Button, ButtonGroup} from '@rneui/themed';
import {RadioButton, TextInput} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import sportsList from '../Assets/sportsList.json';
import {Dropdown} from 'react-native-element-dropdown';

const CreateTeam = () => {
    const [teamName, setTeamName] = useState('');
    const [teamDetail, setTeamDetail] = useState('');
    const [sportValue, setSportValue] = useState('');
    const [teamSize, setTeamSize] = useState();
    const [ageValue, setAgeValue] = useState();
    const [imageSelected, setImageSelected] = useState('');

    const ageData = [
        {value: 'Under 20', label: 'Under 20'},
        {value: 'Under 25', label: 'Under 25'},
        {value: 'Under 30', label: 'Under 30'},
        {value: 'Under 40', label: 'Under 40'},
    ];
    const ageRange = ageData.map(item => ({
        label: item.label,
        value: item.value,
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

    const handleCreateTeam = () => {
        console.log(
            teamName,
            teamDetail,
            sportValue,
            teamSize,
            ageValue,
            imageSelected,
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                        style={{backgroundColor: 'white'}}
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
                        style={{backgroundColor: 'white'}}
                    />
                </View>

                <View style={styles.dropView}>
                    <Text style={styles.dropLabel}>Team sport:</Text>
                    <Dropdown
                        style={styles.dropdown}
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

                <View style={styles.dropView}>
                    <Text style={styles.dropLabel}>Age category:</Text>
                    <Dropdown
                        style={styles.dropdown}
                        selectedTextStyle={styles.selectedTextStyle}
                        containerStyle={styles.dropContainer}
                        iconStyle={styles.iconStyle}
                        data={ageRange}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={'Select age category'}
                        value={ageValue}
                        onChange={item => setAgeValue(item.value)}
                    />
                </View>

                <View>
                    <Text style={styles.subtitle}>Upload team photo:</Text>
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

                <View style={{alignItems: 'center', marginBottom: 30}}>
                    <Button
                        title="Create"
                        onPress={handleCreateTeam}
                        buttonStyle={styles.createButton}
                        titleStyle={{fontSize: 18}}
                    />
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
        marginTop: 50,
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
        width: 300,
        marginTop: 20,
    },
    dropdown: {
        height: 50,
        width: 200,
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
