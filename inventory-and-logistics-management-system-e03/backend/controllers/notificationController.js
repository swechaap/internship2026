const db = require("../config/db");

// GET all notifications
exports.getNotifications = (req, res) => {
    db.query("SELECT * FROM notifications ORDER BY created_at DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        // Normalize field names for frontend compatibility
        const normalized = result.map(n => ({
            id: `NOT-${String(n.notification_id).padStart(3, '0')}`,
            notification_id: n.notification_id,
            type: n.type || 'info',
            title: n.title || 'Notification',
            message: n.message || '',
            timestamp: n.created_at,
            read: n.is_read === 1 || n.is_read === true
        }));
        res.json(normalized);
    });
};

// POST create a notification
exports.createNotification = (req, res) => {
    const { type, title, message } = req.body;
    if (!title || !message) return res.status(400).json({ message: "Title and message are required" });
    const finalType = type || 'info';
    db.query(
        "INSERT INTO notifications (type, title, message, is_read) VALUES (?, ?, ?, 0)",
        [finalType, title, message],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({
                notification_id: result.insertId,
                id: `NOT-${String(result.insertId).padStart(3, '0')}`,
                type: finalType,
                title,
                message,
                timestamp: new Date().toISOString(),
                read: false
            });
        }
    );
};

// PATCH mark one notification as read
exports.markAsRead = (req, res) => {
    const id = req.params.id;
    db.query(
        "UPDATE notifications SET is_read=1 WHERE notification_id=?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Notification marked as read", notification_id: id });
        }
    );
};

// PATCH mark all notifications as read
exports.markAllAsRead = (req, res) => {
    db.query("UPDATE notifications SET is_read=1", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "All notifications marked as read" });
    });
};

// DELETE a notification
exports.deleteNotification = (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM notifications WHERE notification_id=?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Notification deleted", notification_id: id });
    });
};
