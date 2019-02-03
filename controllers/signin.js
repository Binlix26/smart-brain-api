const signin = (db, bcrypt, utility) => (req, res) => {
    let {email, password} = req.body;
    email = utility.normalizeString(email);
    if (!email || !password) {
        res.status(400).json('Invalid Login Information');
        return;
    }
    db(utility.TABLE_LOGINS)
        .select()
        .where('email', '=', email)
        .then(login => {
            bcrypt.compare(password, login[0].hash, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).json('Internal Issue, try later');
                } else if (result) {
                    db(utility.TABLE_USERS)
                        .returning('*')
                        .select()
                        .where('email', '=', email)
                        .then(user => {
                            const currentUser = user[0];
                            console.log(`Preparing to return USER ${currentUser.id} => ${currentUser.email}`);
                            utility.sendUserWithRank(currentUser.id, res, db);
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json('Internal Issue, try later');
                        })
                } else {
                    res.status(400).json('Unable to log in with invalid credential');
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.json('unable to log in with invalid credential');
        });
};

module.exports = {
    handleSignin: signin
};