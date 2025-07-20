import express from 'express';
const router = express.Router()

import { ckeckToken} from "../middleware/tokenValidation.js";

import {
  sendFriendshipRequest,
  acceptFriendshipRequest,
  rejectFriendshipRequest,
  deleteFriendship,
  getAcceptedFriendships,
  getPendingRequests,
  getFriendshipStatus
} from '../controllers/friendship.js'

// Rotas para solicitações de amizade
router.post('/request', ckeckToken, sendFriendshipRequest)
router.patch('/accept', ckeckToken, acceptFriendshipRequest)
router.patch('/reject', ckeckToken, rejectFriendshipRequest)

// Rotas para gerenciar amizades
router.get('/accepted', ckeckToken, getAcceptedFriendships)
router.get('/pending', ckeckToken, getPendingRequests)
router.get('/status', ckeckToken, getFriendshipStatus)
router.delete('/', ckeckToken, deleteFriendship)

export default router