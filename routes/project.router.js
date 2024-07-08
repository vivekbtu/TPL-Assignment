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

        let sortObject = {};
        if (sort === 'projectName') {
            sortObject = { projectName: 1 };
        }
        else if (sort === 'reason') {
          sortObject = { reason: 1 };
        }
        else if (sort === 'type') {
          sortObject = { type: 1 };
        }
        else if (sort === 'division') {
          sortObject = { division: 1 };
        }
        else if (sort === 'category') {
          sortObject = { category: 1 };
        }
        else if (sort === 'priority') {
          sortObject = { priority: 1 };
        }
        else if (sort === 'department') {
          sortObject = { department: 1 };
        }
        else if (sort === 'location') {
          sortObject = { location: 1 };
        }
        else if (sort === 'status') {
          sortObject = { status: 1 };
        }
        //  else {
        //     sortObject = { _id: 1 }; // Default sort by _id in ascending order if sort parameter is invalid
        // }

        let totalData = await ProjectModel.find(query);
        let result = await ProjectModel.find(query)
            .sort(sortObject)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        return res.status(200).send({ status: true, result, total: totalData.length });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ status: false, message: "Something went wrong" });
    }
});

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


projectRouter.get("/overview", async (req, res) => {

    let cusrrentDate = Date.now();
  try {
    let project = await ProjectModel.aggregate([
      // Calculate counts for each status category
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          closedCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Closed"] }, 1, 0],
            },
          },
          runningCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Running"] }, 1, 0],
            },
          },
          cancelledCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0],
            },
          },
          delayedCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "Running"] },
                    { $lt: ["$endDate", cusrrentDate] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);
    return res
      .status(200)
      .send({ status: true, project: project[0] });
  } catch (error) {
    console.log(error);
    res.status(404).send({ status: false, message: "Error" });
  }
})



module.exports = { projectRouter };
