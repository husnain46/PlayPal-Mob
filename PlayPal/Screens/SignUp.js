import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    Text,
    Platform,
} from 'react-native';
import {RadioButton, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../Styles/signupStyles';
import auth from '@react-native-firebase/auth';
import {Button} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import {KeyboardAvoidingView} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {CommonActions} from '@react-navigation/native';

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
    const [isEmailValid, setIsEmailValid] = useState(false);
    const usernamePattern = /^[a-zA-Z0-9_.]{6,20}$/;
    const [passError, setPassError] = useState('');
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const [showPass, setShowPass] = useState(true);

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
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'VerifyMail'}],
            }),
        );
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
            Toast.show({
                type: 'error',
                text2: 'An error occurred!',
            });
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
            Toast.show({
                type: 'error',
                text2: 'Please fill in all fields!',
            });
        } else if (!isEmailValid) {
            Toast.show({
                type: 'error',
                text2: 'Enter a valid email',
            });
        } else if (!isPhoneValid) {
            Toast.show({
                type: 'error',
                text2: 'Enter a valid phone number',
            });
        } else if (!isUsernameAvailable) {
            Toast.show({
                type: 'error',
                text2: 'Enter a valid username',
            });
        } else if (passError !== '') {
            Toast.show({
                type: 'error',
                text2: 'Enter a valid password',
            });
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
                skillLevel: 'Beginner',
                friends: [],
                teamReq: [],
                points: 0,
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
                        Toast.show({
                            type: 'error',
                            text1: 'An error occurred! Please try again.',
                        });
                    }
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        Toast.show({
                            type: 'error',
                            text1: 'The email is already in use!',
                            text2: 'Try another email for signup.',
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'An error occurred! Please try again later.',
                        });
                    }
                })
                .finally(() => {
                    // Set loading to false when the signup process is complete
                    setLoading(false);
                });
        }
    };

    const handleDateChange = (event, selected) => {
        setShowPicker(false);
        if (event.type === 'dismissed') {
            // User canceled the date picker, no need to update the state.
            return;
        }

        if (selected) {
            setSelectedDate(selected.toLocaleDateString('en-GB'));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.bgContainer}
                contentContainerStyle={{
                    alignItems: 'center',
                }}>
                <View style={styles.logoView}>
                    <Image
                        source={require('../Assets/Icons/mainLogo.png')}
                        style={styles.logoImg}
                        resizeMode="contain"
                    />
                </View>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{width: '100%'}}>
                        <View style={styles.nameView}>
                            <TextInput
                                style={styles.textInput1}
                                mode="flat"
                                contentStyle={{paddingLeft: 5}}
                                placeholder="First name"
                                textContentType="name"
                                cursorColor={'#3f70c4'}
                                onChangeText={text => setFirstName(text)}
                                maxLength={15}
                                placeholderTextColor={'darkgrey'}
                            />
                            <TextInput
                                style={styles.textInput1}
                                mode="flat"
                                contentStyle={{paddingLeft: 5}}
                                placeholder="Last name"
                                textContentType="name"
                                cursorColor={'#3f70c4'}
                                onChangeText={text => setLastName(text)}
                                maxLength={15}
                                placeholderTextColor={'darkgrey'}
                            />
                        </View>

                        <View style={styles.radioView}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginEnd: 30,
                                }}>
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
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
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
                        </View>

                        <View style={styles.dobView}>
                            <Text style={styles.dobText}>Date of birth:</Text>

                            <TouchableOpacity
                                style={styles.dateBox}
                                onPress={() => setShowPicker(true)}>
                                {selectedDate ? (
                                    <Text style={styles.dobText}>
                                        {selectedDate}
                                    </Text>
                                ) : (
                                    <Text style={{color: 'darkgrey'}}>
                                        Select date of birth
                                    </Text>
                                )}
                            </TouchableOpacity>
                            {showPicker && (
                                <DateTimePicker
                                    value={backDate}
                                    mode="date"
                                    display="spinner"
                                    minimumDate={new Date(1970, 0, 1)}
                                    maximumDate={backDate}
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>

                        <KeyboardAvoidingView
                            behavior={'height'}
                            style={{width: '100%'}}
                            keyboardVerticalOffset={
                                Platform.OS === 'ios' ? 40 : 50
                            }>
                            <View style={styles.inputView}>
                                <TextInput
                                    placeholder="Email"
                                    textContentType="emailAddress"
                                    inputMode="email"
                                    contentStyle={{paddingLeft: 5}}
                                    cursorColor={'#3f70c4'}
                                    style={styles.textInput3}
                                    onChangeText={text => {
                                        setEmail(text);
                                        if (emailPattern.test(text)) {
                                            setIsEmailValid(true);
                                        } else {
                                            setIsEmailValid(false);
                                        }
                                    }}
                                    placeholderTextColor={'darkgrey'}
                                />
                                {email.length > 0 && !isEmailValid ? (
                                    <Text style={styles.errorText}>
                                        Email address is not valid!
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                <TextInput
                                    placeholder="Mobile no. (e.g. 03xxxxxxxxx)"
                                    style={styles.textInput3}
                                    textContentType="telephoneNumber"
                                    inputMode="numeric"
                                    contentStyle={{paddingLeft: 5}}
                                    cursorColor={'#3f70c4'}
                                    onChangeText={text => {
                                        setPhone(text);
                                        if (phonePattern.test(text)) {
                                            setIsPhoneValid(true);
                                        } else {
                                            setIsPhoneValid(false);
                                        }
                                    }}
                                    placeholderTextColor={'darkgrey'}
                                />
                                {phone.length > 0 && !isPhoneValid ? (
                                    <Text style={styles.errorText}>
                                        Phone number is not valid!
                                    </Text>
                                ) : (
                                    <></>
                                )}
                                <TextInput
                                    placeholder="Username"
                                    cursorColor={'#3f70c4'}
                                    textContentType="username"
                                    inputMode="text"
                                    contentStyle={{paddingLeft: 5}}
                                    style={styles.textInput3}
                                    onChangeText={async text => {
                                        setUsername(text);
                                        await checkUsername(text);
                                    }}
                                    maxLength={20}
                                    placeholderTextColor={'darkgrey'}
                                />
                                {username.length > 0 ? (
                                    <Text
                                        style={{
                                            color: isUsernameAvailable
                                                ? 'green'
                                                : 'red',
                                            bottom: 16,
                                            textAlign: 'right',
                                            fontSize: 13,
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
                                    cursorColor={'#3f70c4'}
                                    style={styles.textInput3}
                                    textContentType="password"
                                    contentStyle={{paddingLeft: 5}}
                                    secureTextEntry={showPass}
                                    onChangeText={handlePasswordChange}
                                    maxLength={20}
                                    placeholderTextColor={'darkgrey'}
                                    right={
                                        <TextInput.Icon
                                            icon={!showPass ? 'eye-off' : 'eye'}
                                            onPress={() =>
                                                setShowPass(!showPass)
                                            }
                                        />
                                    }
                                />
                                {passError !== '' ? (
                                    <Text style={styles.errorText}>
                                        {passError}
                                    </Text>
                                ) : (
                                    <></>
                                )}
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.btnContainer}>
                    <Button
                        title="Signup"
                        titleStyle={styles.submitText}
                        onPress={() => createUser()}
                        containerStyle={styles.submitBtn}
                        loading={loading}
                        loadingProps={{color: 'white'}}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
