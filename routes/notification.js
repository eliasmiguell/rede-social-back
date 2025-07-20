import express from 'express';
const router = express.Router()

import { ckeckToken} from "../middleware/tokenValidation.js";

import { getNotifications, markAsRead, markAllAsRead, markMessageNotificationsAsRead } from '../controllers/notification.js'

// Buscar notificações do usuário
router.get('/', ckeckToken, getNotifications)

// Marcar notificação como lida
router.patch('/mark-read', ckeckToken, markAsRead)

// Marcar todas as notificações como lidas
router.patch('/mark-all-read', ckeckToken, markAllAsRead)

// Marcar notificações de mensagem como lidas
router.patch('/mark-message-read', ckeckToken, markMessageNotificationsAsRead)

export default router