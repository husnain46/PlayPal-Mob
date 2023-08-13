import sportsList from '../Assets/sportsList.json';

const getSportsByIds = sportIds => {
    return sportIds.map(sportId => {
        if (sportsList.hasOwnProperty(sportId)) {
            return sportsList[sportId].name;
        } else {
            return null;
        }
    });
};

export default getSportsByIds;
