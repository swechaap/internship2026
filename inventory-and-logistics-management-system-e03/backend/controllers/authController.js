const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    User.findByEmail(email, async (err, existingUser) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            User.create({ name, email, password: hashedPassword, role: 'user' }, (err, userId) => {
                if (err) return res.status(500).json({ message: 'Error registering user' });
                res.status(201).json({ message: 'User registered successfully', userId });
            });
        } catch (error) {
            res.status(500).json({ message: 'Error encrypting password' });
        }
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    User.findByEmail(email, async (err, user) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            process.env.JWT_SECRET || 'secret_key_123',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token, userId: user.user_id, role: user.role });
    });
};

const getProfile = (req, res) => {
    // The user's ID is appended to the request object by the auth middleware
    User.findById(req.user.userId, (err, user) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({
            userId: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    });
};

module.exports = { register, login, getProfile };
