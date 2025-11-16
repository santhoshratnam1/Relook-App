import React from 'react';
import { EventData } from '../types';
import InfoRow from './InfoRow';
import { CalendarIcon, MapPinIcon } from './IconComponents';

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

    const handleAddToCalendar = () => {
        // Converts local YYYY-MM-DD and HH:MM to UTC YYYYMMDDTHHMMSSZ
        const toUTCDateTime = (dateStr: string, timeStr?: string): string => {
            const localDate = new Date(`${dateStr}T${timeStr || '00:00:00'}`);
            if (isNaN(localDate.getTime())) return '';
            return localDate.toISOString().replace(/[-:]|\.\d{3}/g, '');
        };

        const title = encodeURIComponent(event.title);
        const location = event.location ? encodeURIComponent(event.location) : '';
        
        let detailsParts = [];
        if (event.host) detailsParts.push(`Host: ${event.host}`);
        if (event.speakers && event.speakers.length > 0) detailsParts.push(`Speakers: ${event.speakers.join(', ')}`);
        if (event.registrationLink) detailsParts.push(`Register here: ${event.registrationLink}`);
        const details = encodeURIComponent(detailsParts.join('\n\n'));

        let dates = '';
        if (event.time) {
            const startTime = toUTCDateTime(event.date, event.time);
            
            let endTime = event.endTime ? toUTCDateTime(event.date, event.endTime) : '';
            if (!endTime) {
                const start = new Date(`${event.date}T${event.time}:00`);
                if (!isNaN(start.getTime())) {
                    start.setHours(start.getHours() + 1); // Default to 1 hour duration
                    endTime = start.toISOString().replace(/[-:]|\.\d{3}/g, '');
                }
            }
            if(startTime && endTime) dates = `${startTime}/${endTime}`;
        } else {
            // All-day event
            const startDate = new Date(event.date + 'T00:00:00');
            if (!isNaN(startDate.getTime())) {
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 1);
                
                const startDateStr = startDate.toISOString().split('T')[0].replace(/-/g, '');
                const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
                dates = `${startDateStr}/${endDateStr}`;
            }
        }

        if (dates) {
            const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            alert("Could not create calendar event due to invalid date/time.");
        }
    };

    return (
        <>
            <dl>
                <InfoRow label="Type" value={event.type} icon="🗓️" />
                <InfoRow label="Date" value={formatDate(event.date)} icon="📅" />
                <InfoRow label="Time" value={event.time ? `${event.time}${event.endTime ? ` - ${event.endTime}` : ''}` : undefined} icon="⏰" />
                <InfoRow label="Duration" value={event.duration} icon="⏳" />
                <InfoRow 
                    label="Location" 
                    value={event.location} 
                    icon="📍"
                    action={event.location ? {
                        icon: <MapPinIcon className="w-5 h-5"/>,
                        onClick: () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location!)}`, '_blank'),
                        ariaLabel: 'View location on map'
                    } : undefined}
                />
                <InfoRow label="Host" value={event.host} icon="🏢" />
                <InfoRow label="Organizer" value={event.organizer} icon="🧑‍💼" />
                <InfoRow label="Audience" value={event.targetAudience} icon="👥" />
                <InfoRow label="Cost" value={event.cost} icon="💰" />
                <InfoRow 
                    label="Speakers" 
                    value={event.speakers && event.speakers.join(', ')} 
                    icon="🎤" 
                />
                <InfoRow 
                    label="Topics"
                    value={
                        event.topics && event.topics.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {event.topics.map((topic, index) => (
                                    <span key={index} className="text-xs px-2 py-1 rounded-full bg-slate-600/70 text-slate-300">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        ) : undefined
                    }
                    icon="🧠"
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
            <div className="mt-6">
                <button
                    onClick={handleAddToCalendar}
                    className="w-full flex justify-center items-center space-x-2 font-semibold py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 transition-all"
                >
                    <CalendarIcon className="w-5 h-5"/>
                    <span>Add to Google Calendar</span>
                </button>
            </div>
        </>
    );
};

export default EventView;