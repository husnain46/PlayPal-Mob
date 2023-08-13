import userData from '../Assets/userData.json';

const getPlayerName = userId => {
    const user = userData[userId];

    if (user) {
        return `${user.firstName} ${user.lastName}`;
    } else {
        return 'User not found';
    }
};

export default getPlayerName;
