const handleRegister = (db, bcrypt, utility) => (req, res) => {
    let {name, email, password} = req.body;
// check registration data
    name = utility.normalizeString(name);
    email = utility.normalizeString(email);
    if (!name || !email || !password) {
        res.status(400).json('Invalid Registration Information');
        return;
    }
    bcrypt.hash(password, null, null, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
            console.log('Error when encrypting user password');
            console.log(err);
            // not sure if frontEnd should be notified with this kind of internal issue
            //e.g. failed to encrypt password
            // will stop the registration for now
            res.status(500).json('Sorry that we have a internal issue, please call the support team and try it later');
        } else {
            // inserting user into TABLE users
            db.transaction(trx => {
                trx.insert({
                    email: email,
                    hash: hash
                })
                    .into(utility.TABLE_LOGINS)
                    .returning('email')
                    .then(loginEmail => {
                        return trx(utility.TABLE_USERS)
                            .returning('*')
                            .insert({
                                name: name,
                                email: loginEmail[0],
                                joined: new Date()
                            })
                            .then(user => {
                                res.json(user[0])
                            })
                    })
                    .then(trx.commit)
                    .catch(trx.rollback);
            })
                .catch(err => {
                    console.log(err);
                    res.status(500).json('Unable to Register');
                });
        }
    });
}

module.exports = {
    handleRegister: handleRegister
}