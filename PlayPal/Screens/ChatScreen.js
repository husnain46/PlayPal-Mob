import {Icon} from '@rneui/themed';
import React, {useRef, useState} from 'react';
import {Alert, Image, SafeAreaView} from 'react-native';
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    StyleSheet,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatScreen = ({navigation, route}) => {
    const {user} = route.params;

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const flatListRef = useRef(null);

    const handleDeleteChat = () => {
        Alert.alert(
            'Delete Chat',
            'Are you sure you want to delete this chat?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', style: 'destructive', onPress: confirmDelete},
            ],
        );
    };

    const confirmDelete = () => {
        // Implement logic to delete the chat
        setMessages([]);
        navigation.goBack();
    };

    const handleSend = () => {
        if (inputMessage.trim() === '') {
            return;
        }

        const newMessage = {
            id: Math.random().toString(),
            content: inputMessage,
            sender: 'user', // You can set sender as 'user' for now
            timestamp: new Date().toISOString(), // Add timestamp here
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');
    };

    const formatTimestamp = timestamp => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Image
                    source={{uri: user.profilePic}}
                    style={styles.profilePicture}
                />
                <Text style={styles.username}>
                    {`${user.firstName} ${user.lastName}`}
                </Text>
                <Icon
                    style={{marginLeft: 200}}
                    name="delete"
                    color={'#B95252'}
                    size={30}
                    type="Icons"
                    onPress={handleDeleteChat}
                />
            </View>

            <KeyboardAvoidingView style={styles.flex1}>
                {messages.length > 0 ? (
                    <FlatList
                        ref={flatListRef}
                        style={styles.flex1}
                        data={messages}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <View
                                style={
                                    item.sender === 'user'
                                        ? styles.userMessageContainer
                                        : styles.otherMessageContainer
                                }>
                                <View style={styles.messageContent}>
                                    <Text style={styles.messageText}>
                                        {item.content}
                                    </Text>
                                </View>
                                <Text style={styles.timestampText}>
                                    {formatTimestamp(item.timestamp)}
                                </Text>
                            </View>
                        )}
                        onContentSizeChange={() =>
                            flatListRef.current.scrollToEnd({animated: true})
                        }
                    />
                ) : (
                    <></>
                )}
            </KeyboardAvoidingView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChangeText={text => setInputMessage(text)}
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
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 3,
        borderColor: '#EDEDED',
    },
    profilePicture: {
        width: 45,
        height: 45,

        borderRadius: 30,
        marginRight: 10,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
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
        backgroundColor: '#EDEDED',
        borderRadius: 8,
        padding: 10,
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
        color: '#CCCCCC',
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#EDEDED',
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 10,
    },
    sendButton: {
        backgroundColor: '#0084ff',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginLeft: 10,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ChatScreen;
