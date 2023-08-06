import styles from '../Styles/findplayersStyles';
import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ButtonGroup} from '@rneui/themed';

import {
    Image,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    View,
    Text,
} from 'react-native';
import {
    Button,
    Card,
    SegmentedButtons,
    TextInput,
    Title,
} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import locationIcon from '../Assets/Icons/location.png';
import levelIcon from '../Assets/Icons/level.png';
import sportsIcon from '../Assets/Icons/sports.png';

const FindPlayers = ({navigation}) => {
    const [username, setUsername] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [ageFilter, setAgeFilter] = useState(null);
    const [sportsFilter, setSportsFilter] = useState(null);
    const [levelFilter, setLevelFilter] = useState(null);

    const gotoViewProfile = () => {
        navigation.navigate('ViewProfile');
    };

    const dummyUsers = [
        {
            profilePic:
                'https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg',
            username: 'john_mike2003',
            firstName: 'John',
            lastName: 'Mike',
            gender: 'Male',
            DOB: '26/07/2003',
            city: 'New York',
            area: 'Manhattan',
            preferredSports: ['Basketball', 'Tennis'],
            skillLevel: 'Amateur',
            bio: 'sadasd',
        },
        {
            profilePic:
                'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?cs=srgb&dl=pexels-masha-raymers-2726111.jpg&fm=jpg',
            username: 'jane_tennessee98',
            firstName: 'Jane',
            lastName: 'Tennessee',
            gender: 'Female',
            DOB: '15/12/1998',
            city: 'Los Angeles',
            area: 'Hollywood',
            preferredSports: ['Swimming', 'Running'],
            skillLevel: 'Beginner',
        },
        {
            profilePic:
                'https://1fid.com/wp-content/uploads/2022/06/Twitter-profile-picture-13-1024x1022.jpg',
            username: 'bob_luke1990',
            firstName: 'Bob',
            lastName: 'Luke',
            gender: 'Male',
            DOB: '05/03/1990',
            city: 'Chicago',
            area: 'Downtown',
            preferredSports: ['Football', 'Cycling'],
            skillLevel: 'Pro',
        },
        {
            profilePic:
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80',
            username: 'alice_j1995',
            firstName: 'Alice',
            lastName: 'Johnson',
            gender: 'Female',
            DOB: '10/09/1995',
            city: 'San Francisco',
            area: 'Bay Area',
            preferredSports: ['Yoga', 'Pilates'],
            skillLevel: 'Amateur',
        },
        {
            profilePic:
                'https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg',
            username: 'michael_s2001',
            firstName: 'Michael',
            lastName: 'Smith',
            gender: 'Male',
            DOB: '03/11/2001',
            city: 'London',
            area: 'West End',
            preferredSports: ['Soccer', 'Golf'],
            skillLevel: 'Beginner',
        },
        {
            profilePic:
                'https://images.unsplash.com/photo-1599698011977-c08128ff1652?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D&w=1000&q=80',
            username: 'emma_b1985',
            firstName: 'Emma',
            lastName: 'Brown',
            gender: 'Female',
            DOB: '21/06/1985',
            city: 'Berlin',
            area: 'Mitte',
            preferredSports: ['Dancing', 'Hiking'],
            skillLevel: 'Pro',
        },
    ];

    const sportsList = [
        {value: 'Football', name: 'Football'},
        {value: 'Cricket', name: 'Cricket'},
        {value: 'Tennis', name: 'Tennis'},
        {value: 'Basketball', name: 'Basketball'},
        {value: 'Table Tennis', name: 'Table Tennis'},
        {value: 'Hockey', name: 'Hockey'},
        {value: 'Bedminton', name: 'Bedminton'},
        {value: 'Volleyball', name: 'Volleyball'},
    ];

    const ageRange = [
        {value: 20, label: 'Under 20'},
        {value: 30, label: 'Under 30'},
        {value: 40, label: 'Under 40'},
    ];

    const handleAgeFilterButton = selectedIndex => {
        setAgeFilter(ageRange[selectedIndex].value);
    };

    const skLvl = [
        {label: 'Beginner', value: 'Beginner'},
        {label: 'Amateur', value: 'Amateur'},
        {label: 'Pro', value: 'Pro'},
    ];

    const handleSkillFilterButton = selectedIndex => {
        setLevelFilter(skLvl[selectedIndex].value);
    };

    const resetFilters = () => {
        setSportsFilter(null);
        setAgeFilter(null);
        setLevelFilter(null);
    };

    const getAge = dateString => {
        const today = new Date();
        const [day, month, year] = dateString.split('/').map(Number);
        const birthDate = new Date(year, month - 1, day);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    const [filteredUsers, setFilteredUsers] = useState(dummyUsers);

    const applyFilters = () => {
        const filtered = dummyUsers.filter(user => {
            const isSportsMatched =
                !sportsFilter || user.preferredSports.includes(sportsFilter);
            const isAgeMatched =
                !ageFilter ||
                (getAge(user.DOB) <= ageFilter &&
                    getAge(user.DOB) > ageFilter - 10);

            const isLevelMatched =
                !levelFilter || user.skillLevel === levelFilter;
            return isSportsMatched && isAgeMatched && isLevelMatched;
        });
        setFilteredUsers(filtered);
        setModalVisible(!modalVisible);
    };

    const renderItem = ({item}) => (
        <Card style={styles.card} mode="elevated">
            <Card.Title
                title={`${item.firstName} ${item.lastName}`}
                titleStyle={styles.cardName}
                subtitleStyle={styles.cardUsername}
                subtitle={`@${item.username}`}
                style={styles.cardHeader}
                left={() => (
                    <View>
                        <Image
                            style={styles.dpImage}
                            source={{uri: item.profilePic}}
                            resizeMode="contain"
                        />
                    </View>
                )}
                right={() => (
                    <View style={styles.cardAgeView}>
                        <Text
                            style={{
                                fontSize: 15,
                                marginBottom: 8,
                                color:
                                    item.gender === 'Male' ? 'blue' : '#CA0079',
                            }}>
                            {`(${item.gender}`}
                        </Text>

                        <Text style={styles.ageText}>{` - ${getAge(
                            item.DOB,
                        )} years)`}</Text>
                    </View>
                )}
            />
            <Card.Content>
                <View style={styles.infoContainer}>
                    <View style={styles.cardInfoView}>
                        <Image source={sportsIcon} style={styles.infoIcons} />
                        <Title style={styles.cardSportsText}>
                            {`${item.preferredSports.join(', ')}`}
                        </Title>
                    </View>
                    <View style={styles.cardInfoView}>
                        <Image source={levelIcon} style={styles.infoIcons} />
                        <Text style={styles.userInfo}>
                            {`${item.skillLevel}`}
                        </Text>
                    </View>
                    <View style={styles.cardInfoView}>
                        <Image source={locationIcon} style={styles.infoIcons} />
                        <Text style={styles.userInfo}>
                            {`${item.area}, ${item.city}`}
                        </Text>
                    </View>
                    <Button
                        style={{
                            top: 15,
                            width: 130,
                            alignSelf: 'center',
                        }}
                        mode="outlined"
                        onPress={() => gotoViewProfile()}>
                        View Profile
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchView}>
                <TextInput
                    style={styles.searchBar}
                    outlineStyle={{borderRadius: 12}}
                    mode="outlined"
                    placeholder="Search username"
                    contentStyle={{top: 2}}
                    placeholderTextColor={'grey'}
                    left={
                        <TextInput.Icon
                            style={{paddingTop: 6}}
                            icon={() => (
                                <Icons name="account-search" size={30} />
                            )}
                        />
                    }
                    value={username}
                    onChangeText={text => setUsername(text)}
                />

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image
                        style={styles.filter}
                        source={require('../Assets/Icons/filter.png')}
                    />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.pickerView}>
                            <Text style={styles.filterLabel}>
                                Sports preference:
                            </Text>
                            <View style={styles.pickerStyle}>
                                <Picker
                                    style={{width: 180}}
                                    selectedValue={sportsFilter}
                                    onValueChange={setSportsFilter}
                                    mode="dropdown"
                                    dropdownIconColor={'#143B63'}
                                    dropdownIconRippleColor={'#11867F'}>
                                    <Picker.Item
                                        style={styles.pickerBox}
                                        label="Select sports"
                                        value=""
                                        enabled={false}
                                        color="#11867F"
                                    />
                                    {sportsList.map((sport, index) => (
                                        <Picker.Item
                                            key={index}
                                            style={styles.pickerBox}
                                            label={sport.name}
                                            value={sport.value}
                                            color="black"
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.ageFilterView}>
                            <Text style={styles.agefilterLabel}>
                                Age preference:
                            </Text>
                            <View style={{width: 240}}>
                                <ButtonGroup
                                    buttons={ageRange.map(item => item.label)}
                                    selectedIndex={ageRange.findIndex(
                                        item => item.value === ageFilter,
                                    )}
                                    onPress={handleAgeFilterButton}
                                    containerStyle={{
                                        height: 40,
                                    }}
                                    selectedTextStyle={{color: 'white'}}
                                />
                            </View>
                        </View>

                        <View style={styles.ageFilterView}>
                            <Text style={styles.agefilterLabel}>
                                Skills preference:
                            </Text>
                            <View style={{width: 240}}>
                                <ButtonGroup
                                    buttons={skLvl.map(item => item.label)}
                                    selectedIndex={skLvl.findIndex(
                                        item => item.value === levelFilter,
                                    )}
                                    onPress={handleSkillFilterButton}
                                    containerStyle={{
                                        height: 40,
                                    }}
                                    selectedTextStyle={{color: 'white'}}
                                />
                            </View>
                        </View>

                        <View style={styles.filterBtnView}>
                            <Button
                                style={styles.resetBtn}
                                onPress={() => resetFilters()}>
                                Reset
                            </Button>

                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => applyFilters()}>
                                <Text style={styles.textStyle}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.listView}>
                <FlatList
                    data={filteredUsers}
                    renderItem={renderItem}
                    keyExtractor={item => item.username}
                    contentContainerStyle={{paddingBottom: 180}}
                />
            </View>
        </SafeAreaView>
    );
};

export default FindPlayers;
