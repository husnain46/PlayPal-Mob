import userData from '../Assets/userData.json';

const getPlayerData = userId => {
    const user = userData[userId];
    if (user) {
        return user;
    } else {
        return null;
    }
};

export default getPlayerData;
