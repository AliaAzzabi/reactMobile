const mongoose = require("mongoose");
const User = require("../models/userModel");

const AideSchema = mongoose.Schema({
   
    education: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    },
    medecin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medecin" 
    },
});

AideSchema.post('findOneAndDelete', async function(Aide) {
    try {
        const userId = Aide.user;

        if (userId) {
            await User.findByIdAndDelete(userId);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur associé:", error);
    }
});

module.exports = mongoose.model("Aide", AideSchema);

