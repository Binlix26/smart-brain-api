const Clarifai = require('clarifai');
const app = new Clarifai.App({
    apiKey: process.env.API_CLARIFAI
});

const image = (db, utility) => (req, res) => {
    const {id, url} = req.body;
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, url)
        .then(prediction => {
            const data = prediction.outputs[0].data;
            if (data && data.regions) {
                db(utility.TABLE_USERS)
                    .where('id', '=', id)
                    .increment('entries', 1)
                    .returning('*')
                    .then(user => {
                        utility.sendUserWithRank(user[0].id, res, db, data);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json('DB Issue');
                    });
            } else {
                res.status(400).json('No Face detected');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json('Internal API issue');
        });
};

module.exports = {
    handleImage: image
};