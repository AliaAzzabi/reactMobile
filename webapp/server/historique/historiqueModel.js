const mongoose = require('mongoose');


const historiqueSchema = new mongoose.Schema({
    
  
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
      },
    description: String
    
}, { timestamps: true }); 



module.exports = mongoose.model('Historique', historiqueSchema);
