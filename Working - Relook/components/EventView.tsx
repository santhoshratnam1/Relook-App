import React from 'react';
import { EventData } from '../types';
import InfoRow from './InfoRow';

interface EventViewProps {
  event: EventData;
}

const EventView: React.FC<EventViewProps> = ({ event }) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00'); // Assume local timezone
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC', // Interpret the date part as UTC to avoid timezone shifts
        });
    };

    return (
        <dl>
            <InfoRow label="Type" value={event.type} icon="🗓️" />
            <InfoRow label="Date" value={formatDate(event.date)} icon="📅" />
            <InfoRow label="Time" value={event.time} icon="⏰" />
            <InfoRow label="Location" value={event.location} icon="📍" />
            <InfoRow label="Host" value={event.host} icon="🏢" />
            <InfoRow 
                label="Speakers" 
                value={event.speakers && event.speakers.join(', ')} 
                icon="🎤" 
            />
            <InfoRow 
                label="Agenda" 
                value={
                    event.agenda && event.agenda.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                            {event.agenda.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    ) : undefined
                }
                icon="📝"
            />
            <InfoRow 
                label="Register" 
                value={
                    event.registrationLink ? (
                        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                            {event.registrationLink}
                        </a>
                    ) : undefined
                }
                icon="🔗"
            />
        </dl>
    );
};

export default EventView;
