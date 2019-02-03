const profile = (db, utility) => (req, res) => {
    let {id} = req.params; // important
    id = Number.parseInt(id);
    utility.sendUserWithRank(id, res, db);
};

module.exports = {
    handleProfile: profile
};

