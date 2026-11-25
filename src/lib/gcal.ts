import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  undefined,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: 'v3',
  auth: jwtClient
});

interface EventData {
  title: string;
  location: string;
  startTime: Date;
  endTime: Date;
  description: string;
}

export async function createCalendarEvent(eventData: EventData) {
  try {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: {
        summary: eventData.title,
        location: eventData.location,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime.toISOString(),
          timeZone: 'America/Mexico_City',
        },
        end: {
          dateTime: eventData.endTime.toISOString(),
          timeZone: 'America/Mexico_City',
        },
        colorId: '5', // Color distintivo en el calendario
      },
    });

    return { success: true, eventLink: response.data.htmlLink };
  } catch (error) {
    console.error('Error insertando en Google Calendar:', error);
    return { success: false, error };
  }
}