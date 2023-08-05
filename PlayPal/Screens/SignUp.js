import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    ScrollView,
    Image,
    Text,
    ImageBackground,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../Styles/signupStyles';

const SignUp = ({navigation}) => {
    const [backDate, setBackDate] = useState(new Date());
    const [checked, setChecked] = useState('first');
    const [selectedDate, setSelectedDate] = useState();
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        const currentDate = new Date();
        const newDate = new Date(
            currentDate.getFullYear() - 16,
            currentDate.getMonth(),
            currentDate.getDate(),
        );
        setBackDate(newDate);
    }, []);

    const handleDateChange = (event, selected) => {
        setShowPicker(false);
        if (selected) {
            setSelectedDate(selected.toLocaleDateString('en-GB'));
        }
    };

    const gotoWelcome = () => {
        navigation.navigate('Welcome');
    };

    const gotoLogin = () => {
        navigation.navigate('Login');
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

                        <ScrollView>
                            <TouchableWithoutFeedback
                                onPress={Keyboard.dismiss}>
                                <View style={styles.inner}>
                                    <View style={styles.nameView}>
                                        <TextInput
                                            placeholder="First Name"
                                            style={styles.textInput1}
                                        />
                                        <TextInput
                                            placeholder="Last Name"
                                            style={styles.textInput2}
                                        />
                                    </View>
                                    <View style={styles.radioView}>
                                        <Text style={styles.radioText}>
                                            Male
                                        </Text>
                                        <RadioButton
                                            value="first"
                                            status={
                                                checked === 'first'
                                                    ? 'checked'
                                                    : 'unchecked'
                                            }
                                            onPress={() => setChecked('first')}
                                        />
                                        <Text style={styles.radioText}>
                                            Female
                                        </Text>

                                        <RadioButton
                                            value="second"
                                            status={
                                                checked === 'second'
                                                    ? 'checked'
                                                    : 'unchecked'
                                            }
                                            onPress={() => setChecked('second')}
                                        />
                                    </View>
                                    <View style={styles.dobView}>
                                        <Text style={styles.dobText}>
                                            Date of birth:
                                        </Text>
                                        <View style={styles.dateView}>
                                            <TouchableOpacity
                                                style={styles.dateBox}
                                                onPress={() =>
                                                    setShowPicker(true)
                                                }>
                                                {selectedDate ? (
                                                    <Text
                                                        style={styles.dobText}>
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
                                        />
                                        <TextInput
                                            placeholder="Mobile no. (e.g. 03xxxxxxxxx)"
                                            style={styles.textInput3}
                                        />
                                        <TextInput
                                            placeholder="Username"
                                            style={styles.textInput3}
                                        />
                                        <TextInput
                                            placeholder="Password"
                                            style={styles.textInput3}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                    <View style={styles.btnContainer}>
                                        <Button
                                            title="Submit"
                                            onPress={() => gotoWelcome()}
                                        />
                                    </View>

                                    <View style={styles.footerView}>
                                        <Text style={styles.ftText}>
                                            Already have an account?
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => gotoLogin()}>
                                            <Text style={styles.loginText}>
                                                Login
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        </SafeAreaView>
    );
};

export default SignUp;
