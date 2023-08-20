import teamsData from '../Assets/teamsData.json';

const getMyTeams = playerId => {
    const teamIds = [];

    for (const [teamId, teamInfo] of Object.entries(teamsData)) {
        if (teamInfo.playersId.includes(playerId)) {
            teamIds.push(teamId);
        }
    }

    return teamIds;
};

export default getMyTeams;
