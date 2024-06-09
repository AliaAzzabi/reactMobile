import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Switch,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import CommonBtn from '../components/CommonBtn';
import Toast from 'react-native-toast-message';
import io from 'socket.io-client';

const BookAppointment = ({ navigation }) => {
    const route = useRoute();
    const { medecin } = route.params;
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [isNewPatient, setIsNewPatient] = useState(false);
    const [patientCin, setPatientCin] = useState('');
    const [emailError, setEmailError] = useState('');
    const [dateError, setDateError] = useState('');

    const [patientInfo, setPatientInfo] = useState({
        cin: '',
        nomPrenom: '',
        telephone: '',
        emaill: '',
        sexe: '',
        dateNaissance: '',
        address: '',
        notifier: [],
    });

    const socket = io('http://192.168.126.171:8443');
    useEffect(() => {
        // Écoutez l'événement 'receiveNotification'
        socket.on('receiveNotification', (data) => {
            console.log('Notification reçue via socket :', data);
            // Faites quelque chose avec les données reçues...
        });

        // Nettoyez l'écouteur lorsque le composant est démonté
        return () => {
            socket.off('receiveNotification');
        };
    }, [socket]);

    const [secretaire, setSecretaire] = useState(null);

    useEffect(() => {
        const fetchSecretaire = async () => {
            try {
                const response = await fetch(`http://192.168.126.171:5000/getAidesByMedecinId/${medecin._id}`);
                const aides = await response.json();
                if (aides.length > 0) {
                    setSecretaire(aides);
                }
            } catch (error) {
                console.error("Error fetching secretary:", error);
            }
        };

        fetchSecretaire();
    }, [medecin]);

    const handleInputChange = (field, value) => {
        if (field === 'email') {
            const isValidEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            setEmailError(isValidEmail ? '' : 'Le format de l\'email est invalide.');
        }
        if (field === 'dateNaissance') {
            const isValidDate = /^\d{2}\/\d{2}\/\d{4}$/.test(value);
            setDateError(isValidDate ? '' : 'Le format de la date est invalide.');

        }
        if (field === 'sms' || field === 'email' || field === 'appel') {
            setPatientInfo(prevState => ({
                ...prevState,
                notifier: value ? [...prevState.notifier, field] : prevState.notifier.filter(option => option !== field)
            }));
        } else {
            setPatientInfo({
                ...patientInfo,
                [field]: value
            });
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || selectedDay;
        setShowDatePicker(false);

        // Get today's date without time
        const aujourdhui = new Date();
        aujourdhui.setHours(0, 0, 0, 0);

        // Check if the selected date is today
        if (currentDate.toDateString() === aujourdhui.toDateString()) {
            Toast.show({
                type: 'error',
                text1: 'La réservation pour aujourd\'hui est impossible !',
                text2: 'Veuillez choisir une date ultérieure.',
            });
        }
        // Check if the selected date is in the past
        else if (currentDate < aujourdhui) {
            Toast.show({
                type: 'error',
                text1: 'Date incorrecte',
                text2: 'Veuillez sélectionner une date future.',
            });
        }
        // Check if the selected date is a Sunday
        else if (currentDate.getDay() === 0) { // 0 corresponds to Sunday
            Toast.show({
                type: 'error',
                text1: 'Dimanche',
                text2: 'Nous sommes fermés le dimanche.',
            });
        }
        else {
            setSelectedDay(currentDate);
        }
    };





    const onChangeTime = (event, selectedDate) => {
        const currentTime = selectedDate || selectedTime;
        setShowTimePicker(false);

        const now = new Date();
        const selectedDateTime = new Date(selectedDay);
        selectedDateTime.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);

        const hours = currentTime.getHours();

        if (selectedDateTime < now) {
            Toast.show({
                type: 'error',
                text1: 'La réservation pour aujourd\'hui est impossible !',
                text2: 'Veuillez choisir une date ultérieure.',
            });
        } else if (hours >= 8 && hours < 17) {
            setSelectedTime(currentTime);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Heure incorrecte',
                text2: 'Veuillez sélectionner une heure entre 08:00 et 17:00.',
            });
        }
    };



    const handleBookAppointment = async () => {
        const requiredFields = ['cin', 'nomPrenom', 'telephone', 'emaill', 'sexe', 'dateNaissance', 'address'];
        const isAllFieldsFilled = requiredFields.every(field => patientInfo[field]);
        if (isNewPatient && !isAllFieldsFilled) {
            Toast.show({
                type: 'error',
                text2: 'Veuillez remplir tous les champs obligatoires.'
            });
            return;
        }

        if (!isNewPatient && !patientCin.trim()) {
            Toast.show({
                type: 'error',
                text2: 'Veuillez entrer votre CIN.'
            });
            return;
        }

        if (!secretaire || secretaire.length === 0) {
            alert('Aucun secrétaire associé à ce médecin.');
            return;
        }

        const aidesIds = secretaire.map(sec => sec._id);

        const appointmentData = {
            date: selectedDay,
            time: selectedTime.toLocaleTimeString([]),
            medecin: medecin._id,
            secretaire: aidesIds,
        };

        if (isNewPatient) {
            appointmentData.patient = patientInfo;
        } else {
            appointmentData.cin = patientCin;
        }

        console.log('Données envoyées au backend :', appointmentData);

        try {
            const response = await fetch(
                isNewPatient
                    ? 'http://192.168.126.171:5000/creerrendezvous'
                    : 'http://192.168.126.171:5000/createRendezVousCin',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(appointmentData),
                }
            );

            const responseData = await response.json();

            if (response.ok) {
                navigation.navigate('Success');
            } else {
                if (isNewPatient && responseData.error && responseData.error.includes('CIN')) {
                    Toast.show({
                        type: 'error',
                        text1: 'Un patient avec ce CIN existe déjà.',
                    });
                } else if (responseData.error && responseData.error.includes('CIN n\'existe pas')) {
                    Toast.show({
                        type: 'error',
                        text1: 'Le patient avec ce CIN n\'existe pas.',
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: responseData.error || 'Erreur lors de la réservation du rendez-vous. Veuillez réessayer.',
                    });
                }
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Erreur lors de la réservation du rendez-vous. Veuillez réessayer.',
            });
        }
        if (socket) {
            // Affichez un message dans la console pour indiquer l'envoi de la notification
            console.log('Envoi de la notification via socket :', appointmentData);

            // Émettez l'événement 'sendNotification' avec les données de rendez-vous
            socket.emit('sendNotification', appointmentData);
        }
    };

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <Header
                    icon={require('../image/back.png')}
                    onPress={() => navigation.navigate('Home')}
                    title={'Rendez-Vous 📅 '}
                />
                <Image source={{ uri: 'http://192.168.126.171:5000/' + medecin.user.image.filepath }}
                    style={styles.docImg} />
                <Text style={styles.name}>Dr. {medecin.user.nomPrenom}</Text>
                <Text style={styles.spcl}>Docteur de {medecin.specialite.nom}</Text>
                <Text style={styles.heading}>Planifiez Votre Rendez-vous</Text>

                <View style={styles.datetimeContainer}>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datetimeButton}>
                        <Text style={styles.datetimeText}>Sélectionner la date: {selectedDay.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datetimeButton}>
                        <Text style={styles.datetimeText}>Sélectionner l'heure: {selectedTime.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDay}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}
                {showTimePicker && (
                    <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        display="default"
                        onChange={onChangeTime}
                    />
                )}

                <Text style={styles.heading}>Coordonné Patient</Text>
                <View style={styles.patientInfoContainer}>
                    <Text>Êtes-vous un nouveau patient?</Text>
                    <Switch
                        value={isNewPatient}
                        onValueChange={(value) => setIsNewPatient(value)}
                    />
                    <View style={styles.patientInfoContainer}>
                        {isNewPatient ? (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="CIN du Patient"
                                    maxLength={8}
                                    value={patientInfo.cin}
                                    onChangeText={(text) => handleInputChange('cin', text)}
                                    keyboardType="numeric"

                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nom & Prénom"
                                    value={patientInfo.nomPrenom}
                                    onChangeText={(text) => handleInputChange('nomPrenom', text)}

                                />


                                <View style={styles.phoneContainer}>
                                    <Text style={styles.prefix}>+216</Text>
                                    <TextInput
                                        style={styles.phoneInput}
                                        placeholder="25 222 555"
                                        maxLength={8}
                                        value={patientInfo.telephone}
                                        onChangeText={(text) => handleInputChange('telephone', text)}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={patientInfo.emaill}
                                    onChangeText={(text) => handleInputChange('emaill', text)}
                                />
                                {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Date de naissance (jj/mm/aaaa)"
                                    value={patientInfo.dateNaissance}
                                    onChangeText={(text) => handleInputChange('dateNaissance', text)}
                                />
                                {dateError ? <Text style={styles.error}>{dateError}</Text> : null}

                                <TextInput
                                    style={styles.input}
                                    placeholder="Adresse"
                                    value={patientInfo.address}
                                    onChangeText={(text) => handleInputChange('address', text)}
                                />
                                <View style={styles.radioContainer}>
                                    <Text>Sexe:</Text>
                                    <TouchableOpacity
                                        style={[styles.radioButton, patientInfo.sexe === 'Homme' && styles.radioButtonSelected]}
                                        onPress={() => handleInputChange('sexe', 'Homme')}
                                    >
                                        <Text>Homme</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.radioButton, patientInfo.sexe === 'Femme' && styles.radioButtonSelected]}
                                        onPress={() => handleInputChange('sexe', 'Femme')}
                                    >
                                        <Text>Femme</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.notifyOptions}>
                                    <View style={styles.notifyOption}>
                                        <Text>SMS</Text>
                                        <Switch
                                            value={patientInfo.notifier.includes('sms')}
                                            onValueChange={(checked) => handleInputChange('sms', checked)}
                                        />
                                    </View>
                                    <View style={styles.notifyOption}>
                                        <Text>Email</Text>
                                        <Switch
                                            value={patientInfo.notifier.includes('email')}
                                            onValueChange={(checked) => handleInputChange('email', checked)}
                                        />
                                    </View>
                                    <View style={styles.notifyOption}>
                                        <Text>Appel</Text>
                                        <Switch
                                            value={patientInfo.notifier.includes('appel')}
                                            onValueChange={(checked) => handleInputChange('appel', checked)}
                                        />
                                    </View>
                                </View>

                            </>
                        ) : (
                            <TextInput
                                style={styles.input}
                                placeholder="Entrez votre CIN"
                                value={patientCin}
                                onChangeText={setPatientCin}
                                maxLength={8}
                                keyboardType="numeric"

                            />
                        )}
                    </View>
                </View>
                <View style={styles.btnView}>
                    <CommonBtn
                        w={300}
                        h={45}
                        txt={'Réserver'}
                        status={true}
                        onClick={handleBookAppointment}
                    />
                </View>
            </SafeAreaView>
            <Toast />
        </ScrollView>
    );
};

export default BookAppointment;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    docImg: {
        width: 120,
        height: 130,
        marginTop: 30,
        borderRadius: 30,
        marginBottom: 10,
        alignSelf: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: '700',
        alignSelf: 'center',
        marginTop: 10,
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
    },
    prefix: {
        padding: 10,
        backgroundColor: '#eee',
        borderRightWidth: 1,
        borderColor: 'gray',
    },
    phoneInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    spcl: {
        fontSize: 16,
        fontWeight: '700',
        alignSelf: 'center',
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        color: 'green',
        padding: 5,
        borderRadius: 10,
    },
    heading: {
        color: '#000',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 15,
        marginLeft: 15,
    },
    datetimeContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    datetimeButton: {
        padding: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        marginVertical: 5,
    },
    datetimeText: {
        color: 'blue',
        fontSize: 16,
    },
    patientInfoContainer: {
        marginHorizontal: 15,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    btnView: {
        alignItems: 'center',
        marginTop: 20,
    },
    radioContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    radioButtonSelected: {
        backgroundColor: '#ccc',
    },
    notifyContainer: {
        marginTop: 10,
    },
    notifyOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    notifyOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
