// Importez React, useState et useEffect
import React, { useState, useEffect } from 'react';
// Importez le fichier CSS de Tailwind
import 'tailwindcss/tailwind.css';

function CalendarComponent() {
    // Utilisez useState pour gérer l'état du mois, de l'année, des jours, des jours vides, des événements, du titre de l'événement, de la date de l'événement, du thème de l'événement et de l'état de la modal d'événement
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [noOfDays, setNoOfDays] = useState([]);
    const [blankdays, setBlankdays] = useState([]);
    const [events, setEvents] = useState([]);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTheme, setEventTheme] = useState('blue');
    const [openEventModal, setOpenEventModal] = useState(false);

    // Définissez les noms des mois et des jours
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Définissez les thèmes pour les événements
    const themes = [
        { value: "blue", label: "Blue Theme" },
        { value: "red", label: "Red Theme" },
        { value: "yellow", label: "Yellow Theme" },
        { value: "green", label: "Green Theme" },
        { value: "purple", label: "Purple Theme" }
    ];

    // Utilisez useEffect pour mettre à jour les jours du calendrier lorsque le mois ou l'année change
    useEffect(() => {
        getNoOfDays();
        // Vous pouvez également mettre à jour les événements ici en fonction du mois et de l'année actuels
        // Par exemple, fetchEvents(year, month);
    }, [month, year]);

    // Définissez la fonction pour obtenir le nombre de jours dans le mois et les jours vides
    const getNoOfDays = () => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayOfWeek = new Date(year, month).getDay();
        const blankdaysArray = Array.from({ length: dayOfWeek }, (_, i) => i + 1);
        const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        setBlankdays(blankdaysArray);
        setNoOfDays(daysArray);
    };

    // Définissez la fonction pour vérifier si une date est aujourd'hui
    const isToday = (date) => {
        const today = new Date();
        const d = new Date(year, month, date);
        return today.toDateString() === d.toDateString();
    };

    // Définissez la fonction pour afficher la modal d'événement
    const showEventModal = (date) => {
        setOpenEventModal(true);
        setEventDate(new Date(year, month, date).toDateString());
    };

    // Définissez la fonction pour ajouter un événement
    const addEvent = () => {
        if (eventTitle === '') return;
        setEvents([...events, { event_date: eventDate, event_title: eventTitle, event_theme: eventTheme }]);
        setEventTitle('');
        setEventDate('');
        setEventTheme('blue');
        setOpenEventModal(false);
    };

    return (
        <>
            <div className="container overflow-y-auto ">
                <div className='bg-white rounded-t-lg shadow overflow-hidden'>
                    <h1 className="ml-8 text-xl mb-8 mt-8  text-center leading-7 text-gray-600 font-serif ">Planificateur de rendez-vous</h1>
                </div>

                <div className="bg-white rounded-b-lg shadow overflow-hidden">

                    <div className="flex flex-col sm:flex-row items-center justify-between py-2 px-6">
                        <div className="sm:w-auto mb-4 sm:mb-0">
                            <span className="text-lg font-bold text-gray-800">{MONTH_NAMES[month]}</span>
                            <span className="ml-1 text-lg text-gray-600 font-normal">{year}</span>
                        </div>
                        <div className="border rounded-lg px-1" style={{ paddingTop: '2px' }}>
                            <button
                                type="button"
                                className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 items-center ${month === 0 && 'cursor-not-allowed opacity-25'}`}
                                disabled={month === 0}
                                onClick={() => { setMonth(month - 1); getNoOfDays(); }}
                            >
                                <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="border-r inline-flex h-6"></div>
                            <button
                                type="button"
                                className={`leading-none rounded-lg transition ease-in-out duration-100 inline-flex items-center cursor-pointer hover:bg-gray-200 p-1 ${month === 11 && 'cursor-not-allowed opacity-25'}`}
                                disabled={month === 11}
                                onClick={() => { setMonth(month + 1); getNoOfDays(); }}
                            >
                                <svg className="h-6 w-6 text-gray-500 inline-flex leading-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="-mx-1 -mb-1">
                        <div className="flex flex-wrap" style={{ marginBottom: '-40px' }}>
                            {DAYS.map((day, index) => (
                                <div key={index} style={{ width: '14.26%' }} className="px-2 py-2">
                                    <div className="text-gray-600 text-sm uppercase tracking-wide font-bold text-center">{day}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap border-t border-l">
                            {blankdays.map((blankday, index) => (
                                <div key={index} style={{ width: '14.28%', height: '120px' }} className="text-center border-r border-b px-4 pt-2"></div>
                            ))}
                            {noOfDays.map((date, dateIndex) => (
                                <div key={dateIndex} style={{ width: '14.28%', height: '120px' }} className="px-4 pt-2 border-r border-b relative">
                                    <div
                                        onClick={() => showEventModal(date)}
                                        className={`inline-flex w-6 h-6 items-center justify-center cursor-pointer text-center leading-none rounded-full transition ease-in-out duration-100 ${isToday(date) ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-200'}`}
                                    >{date}</div>
                                   <div style={{ height: '80px' }} className="overflow-y-auto mt-1">
    {events.filter(event => new Date(event.event_date).toDateString() === new Date(year, month, date).toDateString()).map((event, index) => (
        <div key={index} className="px-2 cursor-pointer py-1 rounded-lg mt-1 bg-blue-300 overflow-hidden"  onClick={() => showEventModal(date)}>
            <p className="text-sm truncate leading-tight ">{event.event_title}</p>
        </div>
    ))}
</div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {openEventModal &&
                <div className=" overflow-y-auto fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full bg-black bg-opacity-80">
                    <div className=" overflow-y-auto p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden mt-24">
                        <div className="overflow-y-auto shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer" onClick={() => setOpenEventModal(false)}>
                            <svg className="fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
                            </svg>
                        </div>
                        <div className="shadow w-full rounded-lg bg-white overflow-hidden w-full block p-8">
                            <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">Modifier le rendez-vous</h2>
                            <div className="mb-4">
                                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Nom de patient</label>
                                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Date du visite</label>
                                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="text" value={eventDate} readOnly />
                            </div>
                            <div className="mb-4">
                                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Start time</label>
                                <input type="time" id="startTime" name="startTime" className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" />
                            </div>

                            <div className="inline-block w-64 mb-4">
                                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Docteur</label>
                                <div className="relative">
                                    <select className="block appearance-none w-full bg-gray-200 border-2 border-gray-200 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-gray-700">

                                        <option >Dr. mahjoub</option>
                                        <option >Dr. mlouka</option>
                                        <option >Dr. mahfoudh</option>
                                        <option >Dr. monia</option>

                                    </select>

                                </div>
                            </div>


                            <div className="mb-4">
                                <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">Partager avec le patient via</label>
                                <div className="flex space-x-4">
                                    <input type="radio" id="email" name="shareVia" className="form-radio h-5 w-5 text-gray-600" />
                                    <label htmlFor="email" className="text-gray-800 text-sm">Email</label>
                                    <input type="radio" id="sms" name="shareVia" className="form-radio h-5 w-5 text-gray-600" />
                                    <label htmlFor="sms" className="text-gray-800 text-sm">SMS</label>
                                    <input type="radio" id="whatsapp" name="shareVia" className="form-radio h-5 w-5 text-gray-600" />
                                    <label htmlFor="whatsapp" className="text-gray-800 text-sm">Email et SMS</label>
                                </div>
                            </div>
                            <div className="mt-8 text-right">
                                <button type="button" className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2" onClick={() => setOpenEventModal(false)}>
                                    Annuler
                                </button>
                                <button type="button" className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded-lg shadow-sm" onClick={addEvent}>
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
       </>
    );
}

export default CalendarComponent;
