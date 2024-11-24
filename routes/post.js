import express from 'express';
const router = express.Router()
import {creaPost, getPost }  from '../controllers/post.js'
import { ckeckToken} from "../middleware/tokenValidation.js"

router.get("/", ckeckToken, getPost)
router.post("/", ckeckToken, creaPost)

export default router