import {createContext, useState, useEffect, useCallback} from 'react';
import axios from "axios";
import { API_ENDPOINT } from "../main.jsx";

const CountdownContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
function CountdownProvider({ children }) {
    const [totalSecondsUntilStart, setTotalSecondsUntilStart] = useState(-1);
    const [totalSecondsUntilEnd, setTotalSecondsUntilEnd] = useState(-1);
    
    const [secondsUntilStart, setSecondsUntilStart] = useState(-1);
    const [minutesUntilStart, setMinutesUntilStart] = useState(-1);
    const [hoursUntilStart, setHoursUntilStart] = useState(-1);
    const [daysUntilStart, setDaysUntilStart] = useState(-1);

    const [secondsUntilEnd, setSecondsUntilEnd] = useState(-1);
    const [minutesUntilEnd, setMinutesUntilEnd] = useState(-1);
    const [hoursUntilEnd, setHoursUntilEnd] = useState(-1);
    const [daysUntilEnd, setDaysUntilEnd] = useState(-1);

    const [startTimestamp, setStartTimestamp] = useState(-1);
    const [endTimestamp, setEndTimestamp] = useState(-1);

    const updateSecondsUntilStart = useCallback((localStartTimestamp = startTimestamp) => {
        setTotalSecondsUntilStart(Math.floor((localStartTimestamp - Date.now()) / 1000));
    }, [startTimestamp]);

    const updateSecondsUntilEnd = useCallback((localEndTimestamp = endTimestamp) => {
        setTotalSecondsUntilEnd(Math.floor((localEndTimestamp - Date.now()) / 1000));
    }, [endTimestamp]);

    useEffect(() => {
        let totalSeconds = totalSecondsUntilStart;

        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        setDaysUntilStart(days);
        totalSeconds %= (60 * 60 * 24);
        const hours = Math.floor(totalSeconds / (60 * 60));
        setHoursUntilStart(hours);
        totalSeconds %= (60 * 60);
        const minutes = Math.floor(totalSeconds / 60);
        setMinutesUntilStart(minutes);
        const seconds = totalSeconds % 60;
        setSecondsUntilStart(seconds);

        totalSecondsUntilStart >= 0 && setTimeout(() => updateSecondsUntilStart(), 1000);
    }, [totalSecondsUntilStart, updateSecondsUntilStart]);

    useEffect(() => {
        let totalSeconds = totalSecondsUntilEnd;

        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        setDaysUntilEnd(days);
        totalSeconds %= (60 * 60 * 24);
        const hours = Math.floor(totalSeconds / (60 * 60));
        setHoursUntilEnd(hours);
        totalSeconds %= (60 * 60);
        const minutes = Math.floor(totalSeconds / 60);
        setMinutesUntilEnd(minutes);
        const seconds = totalSeconds % 60;
        setSecondsUntilEnd(seconds);

        totalSecondsUntilEnd >= 0 && setTimeout(updateSecondsUntilEnd, 1000);
    }, [totalSecondsUntilEnd, updateSecondsUntilEnd]);

    useEffect(() => {
        async function getTimestamps() {
            try {
                const startDateTimestamp = await axios.get(API_ENDPOINT + '/starttime');
                setStartTimestamp(startDateTimestamp.data.starttime);
                updateSecondsUntilStart(startDateTimestamp.data.starttime);

                const endTimestampResponse = await axios.get(API_ENDPOINT + '/endtime');
                setEndTimestamp(endTimestampResponse.data.endtime);
                updateSecondsUntilEnd(endTimestampResponse.data.endtime);
            } catch (e) {
                console.error(e);
            }
        }

        getTimestamps().then();
    }, []);

    return (
        <CountdownContext.Provider value={{
            totalSecondsUntilStart, startTimestamp,
            daysUntilStart, hoursUntilStart, minutesUntilStart, secondsUntilStart,

            totalSecondsUntilEnd, endTimestamp,
            daysUntilEnd, hoursUntilEnd, minutesUntilEnd, secondsUntilEnd,
        }}>
            { children }
        </CountdownContext.Provider>
    );
}

export { CountdownProvider, CountdownContext };
