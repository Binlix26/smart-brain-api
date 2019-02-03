const utility = {
    TABLE_USERS: 'users',
    TABLE_LOGINS: 'logins',
    normalizeString: (str) => {
        // maybe add Regex check for email etc in the future
        let toReturn = str;
        if (toReturn) {
            toReturn = str.trim().toLowerCase();
            return toReturn;
        } else {
            return null;
        }
    },
    sendUserWithRank: function (id, response, db, prediction) {
        // the id parameter should be valid in DB
        db.select()
            .from(utility.TABLE_USERS)
            .orderBy('entries', 'desc')
            .then(users => {
                let toReturn = '', rank = 0;
                users.forEach((user, index) => {
                    if (user.id === id) {
                        toReturn = user;
                        rank = index + 1;
                    }
                });
                if (rank) {
                    response.json({
                        profile: toReturn,
                        rank: rank,
                        prediction: prediction ? prediction : ''
                    });
                } else {
                    response.status(400).json('wrong id');
                }
            })
            .catch(err => console.log(err))
    }
};

module.exports = {
    utility: utility
};