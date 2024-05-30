const mongoose = require("mongoose");
const User = require("../models/userModel");

const AdminSchema = mongoose.Schema({
  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
  
  
});

AdminSchema.post('findOneAndDelete', async function(Admin) {
    try {
        const userId = Admin.user;

        if (userId) {
            await User.findByIdAndDelete(userId);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur associé:", error);
    }
});

module.exports = mongoose.model("Admin", AdminSchema);
