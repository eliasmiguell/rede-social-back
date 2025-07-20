import express from 'express';
const router = express.Router()

import { ckeckToken} from "../middleware/tokenValidation.js";

import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notification.js'

// Buscar notificações do usuário
router.get('/', ckeckToken, getNotifications)

// Marcar notificação como lida
router.patch('/mark-read', ckeckToken, markAsRead)

// Marcar todas as notificações como lidas
router.patch('/mark-all-read', ckeckToken, markAllAsRead)

export default router