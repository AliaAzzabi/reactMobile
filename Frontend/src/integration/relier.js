//relier.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.15:4000'
})

export const getAllspecialities = (callback) => {
  api.get('/getAllspecialities')
    .then((res) => callback(res))
    .catch((error) => callback({ error }));
}
export const getMedecins = (callback) => {
    api.get('/getMedecins')
      .then((res) => callback(res))
      .catch((error) => callback({ error }));
  }
  