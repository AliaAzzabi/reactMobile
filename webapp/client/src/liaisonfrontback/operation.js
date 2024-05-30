
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000'
})
export const checkEmailExistence = (email, callback) => {
  axios.post('/checkAideEmailExistence', { email })
      .then((response) => {
          callback(response.data);
      })
      .catch((error) => {
          console.error('Error checking email existence:', error);
          callback({ exists: false, error: 'Server error' });
      });
};
export const getAllspecialities = (callback) => {
  api.get('/getAllspecialities')
    .then((res) => callback(res))
    .catch((error) => callback({ error }));
}

export const getSpecialtyById = async (id) => {
  try {
    const response = await api.get(`/getSpecialtyById/${id}`);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
}

export const addspecialite = (specialite, callback) => {
  api.post('/addspecialite', specialite)
  .then((res) => {
    console.log('Received response:', res);
    callback(res);
  })
  .catch((err) => {
    console.error('Error:', err);
    callback(err.response || err);
  });
}


export const updateSpecialite = (id, updatedData, callback) => {
  api.put(`/updateSpecialite/${id}`, updatedData)
    .then((message) => callback(message))
    .catch((err) => callback(err));
}

export const deleteSpecialite = (id, callback) => {
  api.delete(`/deleteSpecialite/${id}`)
    .then((res) => {
      if (res.data) {
        callback(res.data); 
      } else {
        callback({ error: res.error }); 
      }
    })
    .catch((err) => {
      callback({ error: err.message }); 
    });
}


export const getDepartementById = async (id) => {
    try {
      const response = await api.get(`/getDepartementById/${id}`);
      return response.data;
    } catch (error) {
      return { error: error.message };
    }
  }
  export const getAllDepartement = (callback) => {
    api.get('/getAllDepartement')
      .then((res) => callback(res))
      .catch((error) => callback({ error }));
  }
  export const addDepartement = (depart, callback) => {
    api.post('/addDepartement', depart)
      .then((res) => callback(res))
      .catch((err) => callback(err));
  }
  
  export const updateDepartement = (id, updatedData, callback) => {
    api.put(`/updateDepartement/${id}`, updatedData)
      .then((message) => callback(message))
      .catch((err) => callback(err));
  }
  
  export const deleteDepartement = (id, callback) => {
    api.delete(`/deleteDepartement/${id}`)
      .then((res) => callback(res))
      .catch((err) => callback(err));
  }

  
export const getAllAide = (callback) => {
  api.get('/getAide')
    .then((res) => callback(res))
    .catch((error) => callback({ error }));
}

export const getAideById = async (id) => {
  try {
    const response = await api.get(`/getAideById/${id}`);
    return response.data;
  } catch (error) {
    return { error: error.message };
}
}

export const addaides = (aide, callback) => {
  api.post('/addaides', aide)
    .then((res) => {
      console.log('Received response:', res);
      callback(res);
    })
    .catch((err) => {
      console.error('Error:', err);
      callback(err.response || err);
    });
}
export const addmed = (formData, callback) => {
  api.post('http://localhost:4000/addmed', formData)
      .then((res) => callback(res))
      .catch((err) => {
          // On passe l'erreur et la réponse au callback
          callback(err.response || err);
      });
}

export const updateAide = (id, updatedData, callback) => {
  api.put(`/updateAide/${id}`, updatedData)
    .then((response) => callback(response.data))
    .catch((err) => callback(err));
}

export const deleteAide = (id, callback) => {
  api.delete(`/deleteAide/${id}`)
    .then((res) => callback(res))
    .catch((err) => callback(err));
}


export const getMedecins = (callback) => {
  api.get('/getMedecins')
    .then((res) => callback(res))
    .catch((error) => callback({ error }));
}

export const getMedecinById = async (id) => {
  try {
    const response = await api.get(`/getMedecinById/${id}`);
    return response.data;
  } catch (error) {
    return { error: error.message };
}
}
{/**
export const addMedecin = (medecin, callback) => {
  api.post('/addMedecin', medecin)
    .then((res) => {
      console.log('Received response:', res);
      callback(res);
    })
    .catch((err) => {
      console.error('Error:', err);
      callback(err);
    });
}
 */}
/*export const updateAide = (id, updatedData, callback) => {
  api.put(`/updateAide/${id}`, updatedData)
    .then((response) => callback(response.data))
    .catch((err) => callback(err));
}*/

export const UpdateMedecin = (id, updatedData, callback) => {
  api.put(`/updateMedecin/${id}`, updatedData)
    .then((message) => callback(message))
    .catch((err) => callback(err));
}


export const deleteMedecin = (id, callback) => {
  api.delete(`/deleteMedecin/${id}`)
  .then((res) => {
    if (res.data) {
      callback(res.data); 
    } else {
      callback({ error: res.error }); 
    }
  })
  .catch((err) => {
    callback({ error: err.message }); 
  });
}


export const getPatient = async (id) => {
  try {
    const response = await api.get(`/getPatient`);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
}

export const addPatient = (patient, callback) => {
  api.post('/addPatient', patient)
      .then((res) => {
          console.log('Received response:', res);
          callback(res.data); 
      })
      .catch((err) => {
          console.error('Error:', err.response.data);
          callback(err.response.data); 
      });
};

export const deletePatient = (id, callback) => {
  api.delete(`/deletePatient/${id}`)
    .then((res) => callback(res))
    .catch((err) => callback(err));
}


export const updatePatient = (id, updatedData, callback) => {
  api.put(`/updatePatient/${id}`, updatedData)
    .then((message) => callback(message))
    .catch((err) => callback(err));
}

export const getAllRendezVous = async (userToken) => {
  try {
    const response = await fetch('http://localhost:4000/getAllRendezVous', {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Erreur lors de la récupération des rendez-vous");
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous :', error);
    throw error;
  }
};




export const creerRendezVous = async (userToken, date, patientNom) => {
  try {
    
    const time = date.getHours() + ":" + date.getMinutes();
    
    const response = await fetch('http://localhost:4000/creerrendezvous', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ date, patientNom, time }),
    });
    if (response.ok) {
      return true;
    } else {
      throw new Error("Erreur lors de l'ajout du rendez-vous");
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error);
    throw error;
  }
};



export const updateRendezVous = async (token, rendezVousId, updatedEventData) => {
  const { date, time, patientNom } = updatedEventData;
  
  const response = await fetch(`http://localhost:4000/updateRendezVous/${rendezVousId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ date, time, patientNom })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erreur lors de la mise à jour du rendez-vous');
  }
  return data;
};





export const deleteRendezVous = async (token, rendezVousId) => {
  try {
    const response = await axios.delete(`http://localhost:4000/deleteRendezVous/${rendezVousId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAidesByMedecinId = async (medecinId) => {
  try {
    const response = await api.get(`/getAidesByMedecinId/${medecinId}`);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
}


export const getAllRendezVousAjourdhui = async () => {
  try {
    const response = await api.get('/getrdvAujourdhui');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous d\'aujourd\'hui :', error);
    throw new Error('Erreur lors de la récupération des rendez-vous d\'aujourd\'hui');
  }
};

export const sendEmail = async (formData) => {
  try {
    console.log('Envoi de l\'e-mail avec les données suivantes:', formData);
    const response = await api.post('/sendEmail', formData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
    throw error;
  }
};

export const sendSMS = async (phoneNumber, message) => {
  try {
    console.log(phoneNumber,message);
    const response = await api.post('/sendSMS', { phoneNumber, message });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erreur lors de l\'envoi du SMS');
  }
};


//historique
export const getAllHistoriques = async (id) => {
  try {
    const response = await api.get(`/getallHistorique`);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
}

export const createHistorique = (patient, callback) => {
  api.post('/creerhistorique', patient)
      .then((res) => {
          console.log('Received response:', res);
          callback(res.data); 
      })
      .catch((err) => {
          console.error('Error:', err.response.data);
          callback(err.response.data); 
      });
};

export const deleteHistorique = (id, callback) => {
  api.delete(`/deleteHistorique/${id}`)
    .then((res) => callback(res))
    .catch((err) => callback(err));
}

export const getRendezVousByPatientId = async (patientId) => {
  try {
    const response = await api.get(`/patients/${patientId}/rendezvous`); 
    return response.data;
  } catch (error) {
    console.error('Error fetching rendez-vous:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData, token) => {
  try {
    const response = await axios.put('http://localhost:4000/api/user/profile', userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};



// Cette fonction envoie une requête au serveur pour récupérer les informations du profil utilisateur
export const getUserProfile = async (token) => {
  try {
      const response = await fetch('http://localhost:4000/api/user/getprofile', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) {
          throw new Error('Impossible de récupérer le profil utilisateur');
      }

      const userProfile = await response.json();
      return userProfile;
  } catch (error) {
      throw new Error('Erreur lors de la récupération du profil utilisateur : ' + error.message);
  }
};

export const getAllDemandeRendezVous = async (userToken) => {
  try {
    const response = await fetch('http://localhost:4000/getAlldemandRendezVous', {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Erreur lors de la récupération des rendez-vous");
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous :', error);
    throw error;
  }
};

