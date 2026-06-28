const db = require("../config/db");

// GET all suppliers
exports.getSuppliers = (req, res) => {
    db.query("SELECT * FROM suppliers ORDER BY supplier_id DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

// POST create a supplier
exports.createSupplier = (req, res) => {
    const { supplier_name, name, contact, contact_person, contactPerson, category, email, phone, lead_time, leadTime, status, rating, address } = req.body;
    // Accept both naming conventions
    const finalName = supplier_name || name;
    const finalContact = contact_person || contactPerson || contact || '';
    const finalCategory = category || 'General';
    const finalEmail = email || '';
    const finalPhone = phone || '';
    const finalLeadTime = lead_time || leadTime || 'N/A';
    const finalStatus = status || 'Active';
    const finalRating = rating || 4.0;
    const finalAddress = address || '';

    db.query(
        "INSERT INTO suppliers (supplier_name, contact, category, email, phone, lead_time, status, rating, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [finalName, finalContact, finalCategory, finalEmail, finalPhone, finalLeadTime, finalStatus, finalRating, finalAddress],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({
                message: "Supplier Created successfully",
                supplier_id: result.insertId,
                id: `SUP-${String(result.insertId).padStart(3, '0')}`,
                name: finalName,
                category: finalCategory,
                contactPerson: finalContact,
                email: finalEmail,
                phone: finalPhone,
                leadTime: finalLeadTime,
                status: finalStatus,
                rating: finalRating,
                address: finalAddress,
                joiningDate: new Date().toISOString().split('T')[0]
            });
        }
    );
};

// PUT update a supplier
exports.updateSupplier = (req, res) => {
    const id = req.params.id;
    const { supplier_name, name, contact, contact_person, contactPerson } = req.body;
    const finalName = supplier_name || name;
    const finalContact = contact_person || contactPerson || contact || '';
    db.query(
        "UPDATE suppliers SET supplier_name=?, contact=? WHERE supplier_id=?",
        [finalName, finalContact, id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Supplier Updated successfully", supplier_id: id });
        }
    );
};

// DELETE a supplier
exports.deleteSupplier = (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM suppliers WHERE supplier_id=?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Supplier Deleted successfully", supplier_id: id });
    });
};

// PATCH update supplier status
exports.updateSupplierStatus = (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    db.query(
        "UPDATE suppliers SET status=? WHERE supplier_id=?",
        [status, id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Supplier status updated", supplier_id: id, status });
        }
    );
};
