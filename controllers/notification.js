import {db} from '../connect.js'

// Buscar notificações de um usuário
export const getNotifications = async (req, res)=>{
  const { user_id } = req.query;

  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({ message: "user_id inválido" });
  }
  try {
    const data = await db`
      SELECT 
        n.*,
        u.username as from_username,
        u.userimg as from_userimg
      FROM notifications n
      JOIN users u ON u.id = n.from_user_id
      WHERE n.user_id = ${user_id}
      ORDER BY n.created_at DESC
    `;
   
    return res.status(200).json({ data });
    
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao buscar notificações. Por favor, tente novamente mais tarde." });
  }
}

// Marcar notificação como lida
export const markAsRead = async (req, res) => {
  const { notification_id } = req.body;

  if (!notification_id || isNaN(notification_id)) {
    return res.status(400).json({ message: "notification_id inválido" });
  }

  try {
    await db`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE id = ${notification_id}
    `;
    
    return res.status(200).json({ message: "Notificação marcada como lida" });
    
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return res.status(500).json({ message: "Ocorreu um erro ao marcar notificação como lida." });
  }
}

// Marcar todas as notificações como lidas
export const markAllAsRead = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({ message: "user_id inválido" });
  }

  try {
    await db`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE user_id = ${user_id}
    `;
    
    return res.status(200).json({ message: "Todas as notificações foram marcadas como lidas" });
    
  } catch (error) {
    console.error("Erro ao marcar notificações como lidas:", error);
    return res.status(500).json({ message: "Ocorreu um erro ao marcar notificações como lidas." });
  }
}

// Marcar notificações de mensagem como lidas
export const markMessageNotificationsAsRead = async (req, res) => {
  const { user_id, from_user_id, conversation_id } = req.body;

  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({ message: "user_id inválido" });
  }

  try {
    let query = db`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE user_id = ${user_id} AND notification_type = 'message'
    `;

    // Se fornecido from_user_id, filtrar por usuário específico
    if (from_user_id && !isNaN(from_user_id)) {
      query = db`
        UPDATE notifications 
        SET is_read = TRUE 
        WHERE user_id = ${user_id} 
          AND from_user_id = ${from_user_id} 
          AND notification_type = 'message'
      `;
    }

    // Se fornecido conversation_id, filtrar por conversa específica
    if (conversation_id && !isNaN(conversation_id)) {
      query = db`
        UPDATE notifications 
        SET is_read = TRUE 
        WHERE user_id = ${user_id} 
          AND reference_id = ${conversation_id} 
          AND notification_type = 'message'
      `;
    }

    await query;
    
    return res.status(200).json({ message: "Notificações de mensagem marcadas como lidas" });
    
  } catch (error) {
    console.error("Erro ao marcar notificações de mensagem como lidas:", error);
    return res.status(500).json({ message: "Ocorreu um erro ao marcar notificações como lidas." });
  }
}

// Criar notificação (função utilitária para outros controllers)
export const createNotification = async (user_id, from_user_id, notification_type, reference_id, message) => {
  try {
    await db`
      INSERT INTO notifications (user_id, from_user_id, notification_type, reference_id, message)
      VALUES (${user_id}, ${from_user_id}, ${notification_type}, ${reference_id}, ${message})
    `;
    return true;
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    return false;
  }
}

