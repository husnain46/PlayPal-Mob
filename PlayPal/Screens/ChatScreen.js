import {Divider, Icon} from '@rneui/themed';
import React, {useRef, useState, useEffect} from 'react';
import {Alert, Image, KeyboardAvoidingView, SafeAreaView} from 'react-native';
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';

const ChatScreen = ({navigation, route}) => {
    const {user, chatId, senderId} = route.params;

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const flatListRef = useRef(null);

    useEffect(() => {
        const myId = auth().currentUser.uid;

        const unsubscribe = firestore()
            .collection('chats')
            .doc(chatId)
            .onSnapshot(snapshot => {
                try {
                    if (snapshot.exists) {
                        const chatData = snapshot.data();
                        if (chatData.messages) {
                            const updatedMessages = chatData.messages.map(
                                message => {
                                    if (
                                        !message.readBy ||
                                        !message.readBy.includes(myId)
                                    ) {
                                        // If readBy doesn't exist or myId is not in readBy, update readBy
                                        const updatedReadBy = message.readBy
                                            ? [...message.readBy, myId]
                                            : [myId];
                                        return {
                                            ...message,
                                            readBy: updatedReadBy,
                                        };
                                    }
                                    return message;
                                },
                            );

                            const sortedMessages = updatedMessages.sort(
                                (a, b) => {
                                    return (
                                        new Date(a.timestamp) -
                                        new Date(b.timestamp)
                                    );
                                },
                            );

                            setMessages(sortedMessages);

                            // Update firestore with updated messages
                            firestore()
                                .collection('chats')
                                .doc(chatId)
                                .update({messages: updatedMessages});
                        } else {
                            setMessages([]);
                        }
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text2: error.message,
                    });
                }
            });

        return () => unsubscribe();
    }, []);

    const handleDeleteChat = () => {
        Alert.alert(
            'Clear Chat',
            'Are you sure you want to delete all the messages?',
            [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', style: 'destructive', onPress: confirmDelete},
            ],
        );
    };

    const confirmDelete = async () => {
        try {
            const chatRef = await firestore()
                .collection('chats')
                .doc(chatId)
                .update({messages: []});

            setMessages([]);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error deleting chat!',
                text2: error.message,
            });
        }
    };

    const handleSend = async () => {
        if (inputMessage.trim() === '') {
            return;
        }
        const myId = auth().currentUser.uid;

        const message = {
            sender: senderId,
            text: inputMessage,
            timestamp: new Date().toISOString(),
            readBy: [myId],
        };

        try {
            setInputMessage('');

            await firestore()
                .collection('chats')
                .doc(chatId)
                .update({
                    messages: firestore.FieldValue.arrayUnion(message),
                });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Message not sent!',
                text2: error.message,
            });
        }
    };

    const formatTimestamp = timestamp => {
        if (timestamp) {
            const date = new Date(timestamp);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;

            return `${formattedHours}:${
                minutes < 10 ? '0' + minutes : minutes
            } ${ampm}`;
        }
        return '-';
    };

    const renderItem = ({item, index}) => {
        // Check if it's the first message or if the current message's date differs from the previous one
        const showDateSeparator =
            index === 0 ||
            new Date(item.timestamp).toDateString() !==
                new Date(messages[index - 1].timestamp).toDateString();

        return (
            <>
                {showDateSeparator && (
                    <View style={styles.dateSeparator}>
                        <Divider width={1} style={styles.divider} />
                        <Text style={styles.dateText}>
                            {new Date(item.timestamp).toDateString()}
                        </Text>
                        <Divider width={1} style={styles.divider} />
                    </View>
                )}
                <View
                    style={
                        item.sender === senderId
                            ? styles.userMessageContainer
                            : styles.otherMessageContainer
                    }>
                    <View style={styles.messageContent}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                    <Text style={styles.timestampText}>
                        {formatTimestamp(item.timestamp)}
                    </Text>
                </View>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <View style={styles.headerContainer}>
                    <View style={{flexDirection: 'row'}}>
                        <Image
                            source={{uri: user.profilePic}}
                            style={styles.profilePicture}
                        />
                        <Text style={styles.username}>
                            {`${user.firstName} ${user.lastName}`}
                        </Text>
                    </View>
                    <Icon
                        name="delete"
                        color={'#B95252'}
                        size={30}
                        type="Icons"
                        onPress={handleDeleteChat}
                    />
                </View>
            </KeyboardAvoidingView>

            {messages.length > 0 ? (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    contentContainerStyle={{paddingTop: 10, paddingBottom: 20}}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    onContentSizeChange={() =>
                        flatListRef.current.scrollToEnd({animated: true})
                    }
                />
            ) : (
                <View style={{flex: 1}}></View>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor={'darkgrey'}
                    value={inputMessage}
                    onChangeText={text => setInputMessage(text)}
                    numberOfLines={4}
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSend}>
                    <Icons name="send" color={'white'} size={20} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 2,
        borderColor: 'lightgrey',
    },
    profilePicture: {
        width: 45,
        height: 45,
        borderRadius: 30,
        marginRight: 10,
    },
    username: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'left',
        textAlignVertical: 'center',
        color: 'black',
    },
    flex1: {
        flex: 1,
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        marginVertical: 5,
        marginRight: 10,
        maxWidth: '70%',
        backgroundColor: '#4A5B96',
        borderRadius: 8,
        padding: 10,
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        marginVertical: 5,
        marginLeft: 10,
        maxWidth: '70%',
        backgroundColor: '#50a38d',
        borderRadius: 8,
        padding: 10,
    },
    dateSeparator: {
        width: '98%',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 10,
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 15,
        flexDirection: 'row',
    },
    divider: {
        width: '32%',
    },
    dateText: {
        fontSize: 12,
        color: 'black',
    },
    messageContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageText: {
        color: 'white',
        fontSize: 16,
        marginRight: 5,
    },
    timestampText: {
        fontSize: 12,
        color: '#d9d7d7',
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 65,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#EDEDED',
        paddingHorizontal: 7,
        justifyContent: 'space-between',
    },
    input: {
        width: '84%',
        height: 50,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 10,
        paddingLeft: 10,
        color: 'black',
    },
    sendButton: {
        width: 50,
        height: 50,
        backgroundColor: '#0084ff',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ChatScreen;
