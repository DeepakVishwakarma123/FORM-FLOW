import asyncHandler from "../utils/Async-Handler.js";

let protectedRoute=asyncHandler(
    async function (req,res) {
        res.status(200).json("user payment status are here ")
    }
)

export default protectedRoute