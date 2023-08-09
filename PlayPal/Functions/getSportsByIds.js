const getSportsByIds = (sportIds, sportsList) => {
    return sportIds.map(sportId => {
        if (sportsList.hasOwnProperty(sportId)) {
            return sportsList[sportId].name;
        } else {
            return null;
        }
    });
};

export default getSportsByIds;
