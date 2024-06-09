import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';

const Pending = ({ navigation }) => {
  const [cin, setCin] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  const fetchAppointmentsByCIN = async () => {
    if (!cin) {
      setError('CIN est requis');
      return;
    }

    try {
      const response = await axios.get(`http://192.168.126.171:5000/rdvByCIN`, {
        params: { cin: cin }
      });
      if (response.status === 200 && response.data.length > 0) {
        setAppointments(response.data);
        setError('');
      } else {
        setAppointments([]);
        setError('Aucun rendez-vous trouvé');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setAppointments([]);
        setError('Patient n\'existe pas');
      } else {
        setAppointments([]);
        setError('Erreur lors de la récupération des rendez-vous');
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'accepté':
        return styles.statusAccepted;
      case 'en attente':
        return styles.statusPending;
      case 'refusé':
        return styles.statusRefused;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        icon={require('../image/back.png')}
        onPress={() => navigation.navigate('Home')}
        title={'Statut de votre Rendez-vous'}
      />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par CIN"
          value={cin}
          onChangeText={setCin}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchAppointmentsByCIN}>
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemView}>
            <Image
             source={{ uri: 'http://192.168.126.171:5000/' + item.medecin.user.image.filepath }}
              style={styles.docImage}
            />
              
            <View>
              
              <Text style={styles.name}>Dr.{item.medecin.user.nomPrenom}</Text>
              <Text style={styles.timing}>
                date : {
                  `${new Date(item.date).getDate()}/${new Date(item.date).getMonth() + 1
                  }/${new Date(item.date).getFullYear()}`
                }
              </Text>
              <Text style={styles.timing}>
                Heure : {
                  `${new Date(item.date).getHours()
                  }:${new Date(item.date).getMinutes()}`
                }
              </Text>
            </View>
            <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  searchButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  itemView: {
    width: '94%',
    height: 100,
    borderRadius: 10,
    borderWidth: 0.5,
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  docImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 10,
  },
  name: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 20,
  },
  timing: {
    fontSize: 10,
    marginLeft: 20,
    marginTop: 5,
  },
  status: {
    marginLeft: 50,
    borderRadius: 10,
    padding: 5,
    textAlign: 'center',
  },
  statusAccepted: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusRefused: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  statusDefault: {
    backgroundColor: '#f2f2f2',
    color: 'black',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Pending;
