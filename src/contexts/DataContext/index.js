import PropTypes from "prop-types";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const DataContext = createContext({});

export const api = {
    loadData: async () => {
        const json = await fetch("/events.json");
        return json.json();
    },
};

export const DataProvider = ({children}) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [last, setLast] = useState(null);
    const getData = useCallback(async () => {
        try {
            setData(await api.loadData());
        } catch (err) {
            setError(err);
        }
    }, []);
    const getLast = useCallback(async () => {
        try {
            const {events} = await api.loadData();

            // Trouver l'événement avec la date maximale
            const maxDateEvent = events.reduce((maxEvent, currentEvent) => {
                const maxDate = new Date(maxEvent.date);
                const currentDate = new Date(currentEvent.date);
                return currentDate > maxDate ? currentEvent : maxEvent;
            });

            setLast(maxDateEvent);
        } catch (err) {
            setError(err);
        }
    }, []);
    useEffect(() => {
        // console.log('LAST IN CODE',last)
        if (data) return;
        getData();
        if (last) return;
        getLast();
    });

    return (
        <DataContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
                data,
                last,
                error,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;