import teamsData from '../Assets/teamsData.json';

const getTeamData = teamId => {
    const team = teamsData[teamId];

    if (team) {
        return team;
    } else {
        return null;
    }
};

export default getTeamData;
