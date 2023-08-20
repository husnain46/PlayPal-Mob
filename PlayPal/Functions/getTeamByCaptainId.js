import teamsData from '../Assets/teamsData.json';

const getTeamByCaptainId = cId => {
    for (const teamId in teamsData) {
        if (teamsData[teamId].captainId === cId) {
            return teamsData[teamId];
        }
    }
    return null;
};

export default getTeamByCaptainId;
