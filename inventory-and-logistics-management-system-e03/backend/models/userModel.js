const db = require('../config/db');

const User = {
    create: (userData, callback) => {
        const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(query, [userData.name, userData.email, userData.password, userData.role || 'user'], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.insertId);
        });
    },

    findByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0]);
        });
    },

    findById: (id, callback) => {
        const query = 'SELECT user_id, name, email, role FROM users WHERE user_id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results[0]);
        });
    }
};

module.exports = User;
