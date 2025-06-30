const AccessPassageModel = require('../modules/passageModel')

exports.passageController = async (req, res, next) => {
    const createPassage = req.body;
    try {

        const newPassage = new AccessPassageModel(createPassage);
        await newPassage.save();
        console.log(newPassage);
        res.json({
            isAuth: true,
            errormsg: "Passage upload successfully",
            value: newPassage
        });
    } catch (err) {
        res.json({
            isAuth: false,
            errormsg: err.errorResponse,
        });
    }
}




exports.listPassageController = async (req, res, next) => {
    const createPassage = req.body;
    try {
        console.log("sfjkbsdkj")
        const listPassage = await AccessPassageModel.find();
        res.json({
            isAuth: true,
            errormsg: "Passage list send successfully",
            value: listPassage
        });
    } catch (err) {
        res.json({
            isAuth: false,
            errormsg: err.errorResponse,
        });
    }
}


exports.updatePassageController = async (req, res, next) => {
    const updatePassage = req.body;
    try {

        const Passage = await AccessPassageModel.updateOne(
            { _id: updatePassage._id },
            {
                $set: {
                    answer: updatePassage.answer,
                    question: updatePassage.question,
                    userType: updatePassage.userType,
                }
            }
        );
        res.json({
            isAuth: true,
            errormsg: "Passage list send successfully",
            value: updatePassage
        });
    } catch (err) {
        res.json({
            isAuth: false,
            errormsg: err.errorResponse,
        });
    }
}

exports.deletePassageController = async (req, res, next) => {
    const requestData = req.body;
    try {
        const employeeDelete = await AccessPassageModel.deleteOne({ _id: requestData._id });
        console.log(employeeDelete)
        res.json({
            isAuth: true,
            errormsg: "Deleted successfully",
        });
    } catch (err) {
        res.json({
            isAuth: false,
            errormsg: err.errorResponse,
        });
    }
}