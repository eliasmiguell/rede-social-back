import express from 'express';
import { ckeckToken } from '../middleware/tokenValidation.js';
import {getUserConversation, creacteConversation,  getConversationById, deleteConversation} from '../controllers/conversations.js'
const router = express.Router()

router.post('/', ckeckToken,creacteConversation );
router.get('/', ckeckToken, getUserConversation);
router.get('/userConversation', ckeckToken,  getConversationById);
router.delete('/', ckeckToken,deleteConversation );



export default router; 