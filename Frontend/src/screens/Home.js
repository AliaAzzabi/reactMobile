import { View, FlatList, TouchableOpacity, Text, Image, StyleSheet, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import CommonBtn from '../components/CommonBtn';
import { SafeAreaView } from 'react-native';

const Home = ({ navigation }) => {
    const [specialties, setSpecialties] = useState([]);
    const [medecins, setMedecins] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://192.168.1.15:5000/getAllspecialities')
            .then(response => response.json())
            .then(data => setSpecialties(data))
            .catch(error => console.error('Error fetching specialties:', error));
    }, []);

    useEffect(() => {
        fetch('http://192.168.1.15:5000/getMedecins')
            .then(response => response.json())
            .then(data => setMedecins(data))
            .catch(error => console.error('Error fetching medecins:', error));
    }, []);

    const filteredMedecins = selectedSpecialty
        ? medecins.filter(medecin => medecin.specialite.nom === selectedSpecialty)
        : medecins;

    const searchedMedecins = searchTerm
        ? filteredMedecins.filter(medecin => medecin.user.nomPrenom.toLowerCase().includes(searchTerm.toLowerCase()))
        : filteredMedecins;

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title={'Center santéPlus'}
                icon={require('../image/logo1.png')}
            />
            <FlatList
                data={[{ type: 'banner' }, { type: 'search' }, { type: 'category' }, { type: 'doctors' }]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    if (item.type === 'banner') {
                        return (
                            <View>
                                <Image source={require('../image/banner.jpg')} style={styles.banner} />
                            </View>
                        );
                    } else if (item.type === 'search') {
                        return (
                            <View style={styles.searchContainer}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                />
                            </View>
                        );
                    } else if (item.type === 'category') {
                        return (
                            <View>
                                <Text style={styles.heading}>Selectionner Catégorie</Text>
                                <FlatList
                                    data={[{ nom: 'Afficher tous' }, ...specialties]}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => setSelectedSpecialty(item.nom === 'Afficher tous' ? null : item.nom)}>
                                            <LinearGradient
                                                colors={['#4facfe', '#00f2fe']}
                                                style={styles.linearGradient}
                                            >
                                                <Text style={styles.catName}>
                                                    {item.nom}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item) => item.nom}
                                />
                            </View>
                        );
                    } else if (item.type === 'doctors') {
                        return (
                            <View>
                                <Text style={styles.heading}>Découvrez Nos Médecins</Text>
                                <FlatList
                                    numColumns={2}
                                    data={searchedMedecins}
                                    renderItem={({ item }) => (
                                        <View style={styles.docItem}>
                                          
                                             <Image
                                                source={{ uri: 'http://192.168.1.15:5000/' + item.user.image.filepath }}
                                                style={styles.docImg}
                                            />
                                            <Text style={styles.docName}>Dr. {item.user.nomPrenom}</Text>
                                            <Text style={styles.docSpl}>{item.specialite.nom}</Text>
                                            <CommonBtn
                                                w={150}
                                                h={40}
                                                txt='Rendez-vous 📅🕒'
                                                onClick={() => {
                                                    navigation.navigate('BookAppointment', { medecin: item });
                                                }}
                                            />
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.user.cin}
                                />
                            </View>
                        );
                    }
                }}
            />
            <View style={[styles.bottomView, { alignSelf: 'flex-end' }]}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Pending');
                    }}>
                    <Image
                        source={require('../image/pending.png')}
                        style={styles.bottomIcon}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    banner: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 10,
    },
    searchContainer: {
        padding: 10,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
    },
    heading: {
        color: '#000',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 15,
        marginLeft: 15,
    },
    linearGradient: {
        width: 120,
        height: 80,
        borderRadius: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    catName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    docItem: {
        width: '45%',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 0.2,
        margin: 10,
        padding: 10,
        alignItems: 'center',
    },
    docImg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    docName: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 10,
        textAlign: 'center',
    },
    docSpl: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: '600',
        color: 'green',
        backgroundColor: '#f2f2f2',
        padding: 5,
        borderRadius: 10,
        textAlign: 'center',
    },
    bottomView: {
        width: '20%',
        height: 60,
        borderRadius: 10,
        elevation: 5,
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#fff',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    bottomIcon: {
        width: 30,
        height: 30,
    },
});
