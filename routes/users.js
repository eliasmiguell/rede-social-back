import express from 'express';
import { getUsers, updateUsers } from '../controllers/users.js';
import { ckeckToken} from "../middleware/tokenValidation.js"
const router = express.Router();


router.get("/get-users", getUsers)
router.put("/update-users", ckeckToken, updateUsers)




export default router;