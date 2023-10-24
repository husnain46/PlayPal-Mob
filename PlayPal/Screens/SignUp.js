import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    Image,
    Text,
    ImageBackground,
    Alert,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../Styles/signupStyles';
import auth from '@react-native-firebase/auth';
import {Button} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';

const SignUp = ({navigation}) => {
    const [backDate, setBackDate] = useState(new Date());
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('Male');
    const [selectedDate, setSelectedDate] = useState();
    const [showPicker, setShowPicker] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const phonePattern = /^03[0-4][0-9]{8}$/;
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const usernamePattern = /^[a-zA-Z0-9_.]{6,20}$/;
    const [passError, setPassError] = useState('');

    useEffect(() => {
        const currentDate = new Date();
        const newDate = new Date(
            currentDate.getFullYear() - 16,
            currentDate.getMonth(),
            currentDate.getDate(),
        );
        setBackDate(newDate);
    }, []);

    const gotoVerify = () => {
        navigation.navigate('VerifyMail');
    };

    const checkUsername = async username => {
        try {
            const isValid = usernamePattern.test(username);

            const querySnapshot = await firestore()
                .collection('users')
                .where('username', '==', username)
                .get();

            if (querySnapshot.empty && isValid) {
                // Username is available
                setIsUsernameAvailable(true);
            } else {
                // Username is not available

                setIsUsernameAvailable(false);
            }
        } catch (error) {
            Alert.alert('Error checking username availability:', error);
            return false;
        }
    };

    const handlePasswordChange = text => {
        setPassword(text);
        validatePassword(text);
    };

    // Function to validate the password
    const validatePassword = text => {
        if (text.length < 6) {
            setPassError('Password must be at least 6 characters long');
        } else if (text.includes(' ')) {
            setPassError('Password cannot contain spaces');
        } else {
            setPassError('');
        }
    };

    const createUser = () => {
        if (
            !firstName ||
            !lastName ||
            !selectedDate ||
            !email ||
            !password ||
            !phone ||
            !username
        ) {
            Alert.alert('Error', 'Please fill in all fields.');
        } else if (!isPhoneValid) {
            Alert.alert('Error', 'Phone number is not valid!');
        } else if (passError !== '' || !isUsernameAvailable) {
            alert('Username/Password not valid!');
        } else {
            setLoading(true);

            const userData = {
                firstName,
                lastName,
                gender,
                DOB: selectedDate,
                phone,
                username,
                email,
                area: '',
                bio: '',
                city: '',
                preferredSports: [],
                profilePic: '',
                skillLevel: '',
                friends: [],
                friendReqSent: [],
                friendReqReceived: [],
                teamReq: [],
            };

            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(async userCredential => {
                    const user = userCredential.user;
                    const uid = user.uid;

                    if (user) {
                        await firestore()
                            .collection('users')
                            .doc(uid)
                            .set(userData);
                        await user.sendEmailVerification();
                        gotoVerify();
                    } else {
                        // Handle the case where user is null
                        alert('Error! Some input may be empty.');
                    }
                })
                .catch(error => {
                    alert(error);
                })
                .finally(() => {
                    // Set loading to false when the signup process is complete
                    setLoading(false);
                });
        }
    };

    const handleDateChange = (event, selected) => {
        setShowPicker(false);
        if (selected) {
            setSelectedDate(selected.toLocaleDateString('en-GB'));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.bgImageView}>
                <ImageBackground
                    source={require('../Assets/BGs/blurPic.jpg')}
                    style={styles.bgImage}
                    resizeMode="cover">
                    <View>
                        <View style={styles.logoView}>
                            <Image
                                source={require('../Assets/Icons/Logo.png')}
                                style={styles.logoImg}
                                resizeMode="contain"
                            />
                        </View>

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.inner}>
                                <View style={styles.nameView}>
                                    <TextInput
                                        placeholder="First Name"
                                        style={styles.textInput1}
                                        onChangeText={text =>
                                            setFirstName(text)
                                        }
                                        maxLength={15}
                                    />
                                    <TextInput
                                        placeholder="Last Name"
                                        style={styles.textInput2}
                                        onChangeText={text => setLastName(text)}
                                        maxLength={15}
                                    />
                                </View>
                                <View style={styles.radioView}>
                                    <Text style={styles.radioText}>Male</Text>
                                    <RadioButton
                                        value="first"
                                        status={
                                            gender === 'Male'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setGender('Male')}
                                    />

                                    <Text style={styles.radioText}>Female</Text>
                                    <RadioButton
                                        value="Female"
                                        status={
                                            gender === 'Female'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setGender('Female')}
                                    />
                                </View>
                                <View style={styles.dobView}>
                                    <Text style={styles.dobText}>
                                        Date of birth:
                                    </Text>
                                    <View style={styles.dateView}>
                                        <TouchableOpacity
                                            style={styles.dateBox}
                                            onPress={() => setShowPicker(true)}>
                                            {selectedDate ? (
                                                <Text style={styles.dobText}>
                                                    {selectedDate}
                                                </Text>
                                            ) : (
                                                <Text>
                                                    Select date of birth
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                        {showPicker && (
                                            <DateTimePicker
                                                value={backDate}
                                                mode="date"
                                                display="spinner"
                                                minimumDate={
                                                    new Date(1970, 0, 1)
                                                }
                                                maximumDate={backDate}
                                                onChange={handleDateChange}
                                            />
                                        )}
                                    </View>
                                </View>

                                <View style={styles.inputView}>
                                    <TextInput
                                        placeholder="Email"
                                        style={styles.textInput3}
                                        onChangeText={text => setEmail(text)}
                                    />
                                    <TextInput
                                        placeholder="Mobile no. (e.g. 03xxxxxxxxx)"
                                        style={styles.textInput3}
                                        onChangeText={text => {
                                            setPhone(text);
                                            if (phonePattern.test(text)) {
                                                setIsPhoneValid(true);
                                            } else {
                                                setIsPhoneValid(false);
                                            }
                                        }}
                                    />
                                    <TextInput
                                        placeholder="Username"
                                        style={styles.textInput3}
                                        onChangeText={async text => {
                                            setUsername(text);
                                            await checkUsername(text);
                                        }}
                                        maxLength={20}
                                    />
                                    {username.length > 0 ? (
                                        <Text
                                            style={{
                                                color: isUsernameAvailable
                                                    ? 'green'
                                                    : 'red',
                                                bottom: 18,
                                                right: 12,
                                                textAlign: 'right',
                                            }}>
                                            {isUsernameAvailable
                                                ? 'Username is available'
                                                : 'Username is not available'}
                                        </Text>
                                    ) : (
                                        <></>
                                    )}

                                    <TextInput
                                        placeholder="Password"
                                        style={styles.textInput3}
                                        secureTextEntry={true}
                                        onChangeText={handlePasswordChange}
                                        maxLength={20}
                                    />
                                    {passError !== '' ? (
                                        <Text
                                            style={{
                                                color: 'red',
                                                bottom: 18,
                                                left: 10,
                                                textAlign: 'left',
                                            }}>
                                            {passError}
                                        </Text>
                                    ) : (
                                        <></>
                                    )}
                                </View>
                                <View style={styles.btnContainer}>
                                    {loading ? (
                                        <ActivityIndicator
                                            size="large"
                                            color="#0000ff"
                                        />
                                    ) : (
                                        <Button
                                            title="Signup"
                                            titleStyle={styles.submitText}
                                            onPress={() => createUser()}
                                            containerStyle={styles.submitBtn}
                                        />
                                    )}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ImageBackground>
            </View>
        </SafeAreaView>
    );
};

export default SignUp;
