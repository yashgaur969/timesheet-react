/**
 * @author: Tejas Upmanyu (@tejasupmanyu)
 * App Component
 */
import React from 'react';
import './App.scss';
import addIcon from './assets/plus-icon.svg';
import { NewEntrySheet, IEntry } from './components/NewEntrySheet';
import { TaskList, TaskCard } from './components/TaskList';
import { storageKey, maxWorkingMinutes, progressColorMap } from './constants/constants';

const App: React.FC = () => {
    const [isEntrySheetOpen, setIsEntrySheetOpen] = React.useState(false);
    const [entries, setEntries] = React.useState<IEntry[]>([]);

    // load task entries from local storage when component renders for the first time.
    React.useEffect(() => {
        loadTaskEntries();
    }, []);

    const openEntrySheet = () => {
        setIsEntrySheetOpen(true);
    };

    const closeEntrySheet = () => {
        setIsEntrySheetOpen(false);
    };

    const onAddEntry = (entry: IEntry) => {
        if (entries) {
            const newTasks = [...entries, entry];
            storeTaskEntries(newTasks);
        } else {
            storeTaskEntries([entry]);
        }
        closeEntrySheet();
    };

    const onRemoveEntry = (id: number) => {
        if (entries) {
            const filteredTasks = entries.filter((entry: IEntry) => entry.id !== id);
            storeTaskEntries(filteredTasks);
        }
    };

    const loadTaskEntries = () => {
        const entriesString = window.localStorage.getItem(storageKey);
        const entries = entriesString ? JSON.parse(entriesString) : [];
        setEntries(entries);
    };

    const storeTaskEntries = (entries: IEntry[]) => {
        window.localStorage.setItem(storageKey, JSON.stringify(entries));
        loadTaskEntries();
    };

    const getProgressBarStyling = () => {
        let progress = 0;
        let totalTimeSpentInMinutes = 0;
        entries.forEach((entry: IEntry) => {
            totalTimeSpentInMinutes += parseInt(entry.hours) * 60 + parseInt(entry.minutes);
        });
        progress = (totalTimeSpentInMinutes / maxWorkingMinutes) * 100;
        progress = progress > 100 ? 100 : progress;
        if (totalTimeSpentInMinutes >= maxWorkingMinutes) {
            return { width: `${progress}%`, background: progressColorMap.HIGH };
        } else if (totalTimeSpentInMinutes < 480 && totalTimeSpentInMinutes >= 240) {
            return { width: `${progress}%`, background: progressColorMap.MEDIUM };
        } else {
            return { width: `${progress}%`, background: progressColorMap.LOW };
        }
    };

    return (
        <div className="app-container">
            <h1>Timesheet</h1>
            <section className="progress-container">
                <div className="progress-bar" style={{ ...getProgressBarStyling() }}></div>
            </section>
            <TaskList>
                {entries.length > 0 ? (
                    entries.map((entry: IEntry) => (
                        <TaskCard key={entry.id} entry={entry} onRemove={() => onRemoveEntry(entry.id)} />
                    ))
                ) : (
                    <p className="empty-text">No entries yet. Add a new entry by clicking the + button.</p>
                )}
            </TaskList>
            <button className="floating-add-entry-btn" onClick={openEntrySheet}>
                <img className="add-icon" src={addIcon} alt="add entry" />
            </button>
            {isEntrySheetOpen && <NewEntrySheet onClose={closeEntrySheet} onAdd={onAddEntry} />}
        </div>
    );
};

export default App;
