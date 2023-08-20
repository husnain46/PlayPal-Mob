import tournamentData from '../Assets/tournamentData.json';

const getMyTournament = teamIds => {
    const myTournaments = {};

    for (const [tournamentId, tournamentInfo] of Object.entries(
        tournamentData,
    )) {
        if (teamIds.some(teamId => tournamentInfo.teamIds.includes(teamId))) {
            myTournaments[tournamentId] = tournamentInfo;
        }
    }

    return myTournaments;
};

export default getMyTournament;
