import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage, StorageKeys } from '../utils/localStorage';
import * as mockData from '../data/mockData';

// Types
export type Tutor = typeof mockData.tutors[0];
export type Student = typeof mockData.tutorStudents[0];
export type Booking = typeof mockData.bookings[0];
export type Session = typeof mockData.sessions[0];
export type Material = typeof mockData.materials[0];
export type Payroll = typeof mockData.payroll[0];
export type Availability = typeof mockData.tutorAvailability[0];
export type Location = typeof mockData.tutorLocations[0];
export type SessionCompletion = typeof mockData.sessionCompletions[0];
export type Notification = typeof mockData.notifications[0];
export type SessionEvidence = typeof mockData.sessionEvidences[0];

interface DataContextType {
  // Data
  tutors: Tutor[];
  students: Student[];
  bookings: Booking[];
  sessions: Session[];
  materials: Material[];
  payroll: Payroll[];
  availability: Availability[];
  locations: Location[];
  sessionCompletions: SessionCompletion[];
  notifications: Notification[];
  sessionEvidences: SessionEvidence[];

  // Tutor methods
  addTutor: (tutor: Tutor) => void;
  updateTutor: (id: string, tutor: Partial<Tutor>) => void;
  deleteTutor: (id: string) => void;

  // Student methods
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Booking methods
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;

  // Session methods
  addSession: (session: Session) => void;
  updateSession: (id: string, session: Partial<Session>) => void;
  deleteSession: (id: string) => void;

  // Material methods
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, material: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;

  // Payroll methods
  addPayroll: (payroll: Payroll) => void;
  updatePayroll: (id: string, payroll: Partial<Payroll>) => void;
  deletePayroll: (id: string) => void;

  // Availability methods
  addAvailability: (availability: Availability) => void;
  updateAvailability: (id: string, availability: Partial<Availability>) => void;
  deleteAvailability: (id: string) => void;

  // Location methods
  addLocation: (location: Location) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;

  // Session Completion methods
  addSessionCompletion: (completion: SessionCompletion) => void;
  updateSessionCompletion: (id: string, completion: Partial<SessionCompletion>) => void;

  // Session Evidence methods
  addSessionEvidence: (evidence: SessionEvidence) => void;
  updateSessionEvidence: (id: string, evidence: Partial<SessionEvidence>) => void;
  deleteSessionEvidence: (id: string) => void;

  // Notification methods
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;

  // Utility
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or use mock data
  const [tutors, setTutors] = useState<Tutor[]>(() => 
    storage.get<Tutor[]>(StorageKeys.TUTORS) || mockData.tutors
  );
  
  const [students, setStudents] = useState<Student[]>(() => 
    storage.get<Student[]>(StorageKeys.STUDENTS) || mockData.tutorStudents
  );
  
  const [bookings, setBookings] = useState<Booking[]>(() => 
    storage.get<Booking[]>(StorageKeys.BOOKINGS) || mockData.bookings
  );
  
  const [sessions, setSessions] = useState<Session[]>(() => 
    storage.get<Session[]>(StorageKeys.SESSIONS) || mockData.sessions
  );
  
  const [materials, setMaterials] = useState<Material[]>(() => 
    storage.get<Material[]>(StorageKeys.MATERIALS) || mockData.materials
  );
  
  const [payroll, setPayroll] = useState<Payroll[]>(() => 
    storage.get<Payroll[]>(StorageKeys.PAYROLL) || mockData.payroll
  );
  
  const [availability, setAvailability] = useState<Availability[]>(() => 
    storage.get<Availability[]>(StorageKeys.AVAILABILITY) || mockData.tutorAvailability
  );
  
  const [locations, setLocations] = useState<Location[]>(() => 
    storage.get<Location[]>(StorageKeys.LOCATIONS) || mockData.tutorLocations
  );
  
  const [sessionCompletions, setSessionCompletions] = useState<SessionCompletion[]>(() => 
    storage.get<SessionCompletion[]>(StorageKeys.SESSION_COMPLETIONS) || mockData.sessionCompletions
  );
  
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    storage.get<Notification[]>(StorageKeys.NOTIFICATIONS) || mockData.notifications
  );

  const [sessionEvidences, setSessionEvidences] = useState<SessionEvidence[]>(() =>
    storage.get<SessionEvidence[]>(StorageKeys.SESSION_EVIDENCES) || mockData.sessionEvidences
  );

  // Persist to localStorage whenever data changes
  useEffect(() => {
    storage.set(StorageKeys.TUTORS, tutors);
  }, [tutors]);

  useEffect(() => {
    storage.set(StorageKeys.STUDENTS, students);
  }, [students]);

  useEffect(() => {
    storage.set(StorageKeys.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    storage.set(StorageKeys.SESSIONS, sessions);
  }, [sessions]);

  useEffect(() => {
    storage.set(StorageKeys.MATERIALS, materials);
  }, [materials]);

  useEffect(() => {
    storage.set(StorageKeys.PAYROLL, payroll);
  }, [payroll]);

  useEffect(() => {
    storage.set(StorageKeys.AVAILABILITY, availability);
  }, [availability]);

  useEffect(() => {
    storage.set(StorageKeys.LOCATIONS, locations);
  }, [locations]);

  useEffect(() => {
    storage.set(StorageKeys.SESSION_COMPLETIONS, sessionCompletions);
  }, [sessionCompletions]);

  useEffect(() => {
    storage.set(StorageKeys.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    storage.set(StorageKeys.SESSION_EVIDENCES, sessionEvidences);
  }, [sessionEvidences]);

  // Tutor methods
  const addTutor = (tutor: Tutor) => {
    setTutors((prev) => [...prev, tutor]);
  };

  const updateTutor = (id: string, updatedData: Partial<Tutor>) => {
    setTutors((prev) =>
      prev.map((tutor) => (tutor.id === id ? { ...tutor, ...updatedData } : tutor))
    );
  };

  const deleteTutor = (id: string) => {
    setTutors((prev) => prev.filter((tutor) => tutor.id !== id));
  };

  // Student methods
  const addStudent = (student: Student) => {
    setStudents((prev) => [...prev, student]);
  };

  const updateStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, ...updatedData } : student))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  // Booking methods
  const addBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const updateBooking = (id: string, updatedData: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, ...updatedData } : booking))
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  // Session methods
  const addSession = (session: Session) => {
    setSessions((prev) => [...prev, session]);
  };

  const updateSession = (id: string, updatedData: Partial<Session>) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === id ? { ...session, ...updatedData } : session))
    );
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  // Material methods
  const addMaterial = (material: Material) => {
    setMaterials((prev) => [...prev, material]);
  };

  const updateMaterial = (id: string, updatedData: Partial<Material>) => {
    setMaterials((prev) =>
      prev.map((material) => (material.id === id ? { ...material, ...updatedData } : material))
    );
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((material) => material.id !== id));
  };

  // Payroll methods
  const addPayroll = (payrollItem: Payroll) => {
    setPayroll((prev) => [...prev, payrollItem]);
  };

  const updatePayroll = (id: string, updatedData: Partial<Payroll>) => {
    setPayroll((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deletePayroll = (id: string) => {
    setPayroll((prev) => prev.filter((item) => item.id !== id));
  };

  // Availability methods
  const addAvailability = (availabilityItem: Availability) => {
    setAvailability((prev) => [...prev, availabilityItem]);
  };

  const updateAvailability = (id: string, updatedData: Partial<Availability>) => {
    setAvailability((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteAvailability = (id: string) => {
    setAvailability((prev) => prev.filter((item) => item.id !== id));
  };

  // Location methods
  const addLocation = (location: Location) => {
    setLocations((prev) => [...prev, location]);
  };

  const updateLocation = (id: string, updatedData: Partial<Location>) => {
    setLocations((prev) =>
      prev.map((location) => (location.id === id ? { ...location, ...updatedData } : location))
    );
  };

  const deleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((location) => location.id !== id));
  };

  // Session Completion methods
  const addSessionCompletion = (completion: SessionCompletion) => {
    setSessionCompletions((prev) => [...prev, completion]);
  };

  const updateSessionCompletion = (id: string, updatedData: Partial<SessionCompletion>) => {
    setSessionCompletions((prev) =>
      prev.map((completion) => (completion.id === id ? { ...completion, ...updatedData } : completion))
    );
  };

  // Notification methods
  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Session Evidence methods
  const addSessionEvidence = (evidence: SessionEvidence) => {
    setSessionEvidences((prev) => [...prev, evidence]);
  };

  const updateSessionEvidence = (id: string, updatedData: Partial<SessionEvidence>) => {
    setSessionEvidences((prev) =>
      prev.map((evidence) => (evidence.id === id ? { ...evidence, ...updatedData } : evidence))
    );
  };

  const deleteSessionEvidence = (id: string) => {
    setSessionEvidences((prev) => prev.filter((evidence) => evidence.id !== id));
  };

  // Reset all data to mock data
  const resetData = () => {
    setTutors(mockData.tutors);
    setStudents(mockData.tutorStudents);
    setBookings(mockData.bookings);
    setSessions(mockData.sessions);
    setMaterials(mockData.materials);
    setPayroll(mockData.payroll);
    setAvailability(mockData.tutorAvailability);
    setLocations(mockData.tutorLocations);
    setSessionCompletions(mockData.sessionCompletions);
    setNotifications(mockData.notifications);
    setSessionEvidences(mockData.sessionEvidences);
  };

  const value: DataContextType = {
    // Data
    tutors,
    students,
    bookings,
    sessions,
    materials,
    payroll,
    availability,
    locations,
    sessionCompletions,
    notifications,
    sessionEvidences,

    // Methods
    addTutor,
    updateTutor,
    deleteTutor,
    addStudent,
    updateStudent,
    deleteStudent,
    addBooking,
    updateBooking,
    deleteBooking,
    addSession,
    updateSession,
    deleteSession,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    addPayroll,
    updatePayroll,
    deletePayroll,
    addAvailability,
    updateAvailability,
    deleteAvailability,
    addLocation,
    updateLocation,
    deleteLocation,
    addSessionCompletion,
    updateSessionCompletion,
    addSessionEvidence,
    updateSessionEvidence,
    deleteSessionEvidence,
    addNotification,
    markNotificationAsRead,
    deleteNotification,
    resetData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
