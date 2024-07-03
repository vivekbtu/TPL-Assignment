const { Router } = require("express");
const { ProjectModel } = require("../models/project.model");

const projectRouter = Router();

projectRouter.get("/", async (req, res) => {

    let { q, sort, page = 1, limit = 10 } = req.query;
    // Optimized logic
    console.log("qqqq",q,sort)
    try {
        let query = q
            ? {
                $or: [
                    { projectName: new RegExp(q, "i") },
                    { reason: new RegExp(q, "i") },
                    { type: new RegExp(q, "i") },
                    { division: new RegExp(q, "i") },
                    { category: new RegExp(q, "i") },
                    { priority: new RegExp(q, "i") },
                    { department: new RegExp(q, "i") },
                    { location: new RegExp(q, "i") },
                    { status: new RegExp(q, "i") },
                ],
            }
            : {};

        let totalData = await ProjectModel.find(query);
        let result = await Project.find(query).sort(sort ? { [sort]: 1 } : {}).limit(parseInt(limit)).skip(parseInt(page - 1) * parseInt(limit));

        return res.status(200).send({ status: true, result, total: totalData.length });

    }
    catch (error) {
        res.status(404).send({ status: false, message: "Something went wrong" });
    }
})

projectRouter.post("/post", async (req, res) => {
    let data = req.body;
    try {
        let project = await ProjectModel.create({ ...data });
        return res.status(200).send({ status: true, message: "New project added successfully" });

    }
    catch (error) {

        res.status(404).send({ status: false, message: "New project addition unsuccessfull" });
    }
})

// graph status
projectRouter.get("/status", async (req, res) => {

    try {
        let project = await ProjectModel.aggregate([
            {
                $group: {
                    _id: "$department",
                    total: { $sum: 1 },
                    closedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "Closed"] }, 1, 0] },
                    },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        return res.status(200).send({ status: true, project });
    }
    catch (error) {
        res.status(404).send({ status: false, message: "Error" });
    }
})


projectRouter.patch("/:id", async (req, res) => {

    let { id } = req.params;
    let { status } = req.body;
    try {
        let project = await ProjectModel.findByIdAndUpdate({ _id: id }, { status });
        return res
            .status(200)
            .send({ status: true, message: "Project status updated successfully" });
    }
    catch (error) {
        res
            .status(404)
            .send({ status: false, message: "Project status not get updated" });
    }
})



module.exports = { projectRouter };
