import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { initialTherapies, initialTherapists, initialConditions, initialReviews } from '../data/seedData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  const [therapies, setTherapies] = useState(initialTherapies);
  const [therapists, setTherapists] = useState(initialTherapists);
  const [conditions, setConditions] = useState(initialConditions);
  const [reviews, setReviews] = useState(initialReviews);
  const [appointments, setAppointments] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Helper to normalize backend object IDs to `id` property
  const normalizeItem = (item) => {
    if (!item) return item;
    return {
      ...item,
      id: item._id ? item._id.toString() : item.id
    };
  };

  const normalizeList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map(normalizeItem);
  };

  // Fetch Public Data
  const fetchPublicData = useCallback(async () => {
    try {
      const [therapistsRes, therapiesRes, conditionsRes, reviewsRes] = await Promise.allSettled([
        api.get('/therapists'),
        api.get('/therapies'),
        api.get('/conditions'),
        api.get('/reviews')
      ]);

      if (therapistsRes.status === 'fulfilled' && therapistsRes.value.data.success && therapistsRes.value.data.therapists.length > 0) {
        setTherapists(normalizeList(therapistsRes.value.data.therapists));
      } else {
        setTherapists(initialTherapists);
      }

      if (therapiesRes.status === 'fulfilled' && therapiesRes.value.data.success && therapiesRes.value.data.therapies.length > 0) {
        setTherapies(normalizeList(therapiesRes.value.data.therapies));
      } else {
        setTherapies(initialTherapies);
      }

      if (conditionsRes.status === 'fulfilled' && conditionsRes.value.data.success && conditionsRes.value.data.conditions.length > 0) {
        setConditions(normalizeList(conditionsRes.value.data.conditions));
      } else {
        setConditions(initialConditions);
      }

      if (reviewsRes.status === 'fulfilled' && reviewsRes.value.data.success && reviewsRes.value.data.reviews.length > 0) {
        setReviews(normalizeList(reviewsRes.value.data.reviews));
      } else {
        setReviews(initialReviews);
      }
    } catch (err) {
      console.error('Error loading public data:', err);
    }
  }, []);

  // Fetch Authenticated Data based on User Role
  const fetchAuthenticatedData = useCallback(async () => {
    if (!user) {
      setAppointments([]);
      setInquiries([]);
      return;
    }

    try {
      if (user.role === 'admin' || user.role === 'receptionist') {
        const [appRes, inqRes] = await Promise.allSettled([
          api.get('/appointments'),
          api.get('/contact')
        ]);
        if (appRes.status === 'fulfilled' && appRes.value.data.success) {
          setAppointments(normalizeList(appRes.value.data.appointments));
        }
        if (inqRes.status === 'fulfilled' && inqRes.value.data.success) {
          setInquiries(normalizeList(inqRes.value.data.messages));
        }
      } else if (user.role === 'therapist') {
        const [appRes, msgRes] = await Promise.allSettled([
          api.get('/therapist/appointments'),
          api.get('/therapist/messages')
        ]);
        if (appRes.status === 'fulfilled' && appRes.value.data.success) {
          setAppointments(normalizeList(appRes.value.data.appointments));
        }
        if (msgRes.status === 'fulfilled' && msgRes.value.data.success) {
          setInquiries(normalizeList(msgRes.value.data.messages));
        }
      }
    } catch (err) {
      console.error('Error loading user-specific data:', err);
    }
  }, [user]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPublicData(), fetchAuthenticatedData()]);
    setLoading(false);
  }, [fetchPublicData, fetchAuthenticatedData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // --- Therapies CRUD ---
  const addTherapy = async (data) => {
    const response = await api.post('/therapies', data);
    if (response.data.success) {
      const newTherapy = normalizeItem(response.data.therapy);
      setTherapies((prev) => [newTherapy, ...prev]);
      return newTherapy;
    }
    throw new Error(response.data.message || 'Failed to add therapy.');
  };

  const updateTherapy = async (id, data) => {
    const response = await api.put(`/therapies/${id}`, data);
    if (response.data.success) {
      const updated = normalizeItem(response.data.therapy);
      setTherapies((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    }
    throw new Error(response.data.message || 'Failed to update therapy.');
  };

  const deleteTherapy = async (id) => {
    const response = await api.delete(`/therapies/${id}`);
    if (response.data.success) {
      setTherapies((prev) => prev.filter((t) => t.id !== id));
      return true;
    }
    throw new Error(response.data.message || 'Failed to delete therapy.');
  };

  const toggleTherapyStatus = async (id) => {
    const existing = therapies.find((t) => t.id === id);
    if (!existing) return;
    const newStatus = existing.status === 'active' ? 'inactive' : 'active';
    await updateTherapy(id, { status: newStatus });
  };

  // --- Therapists CRUD ---
  const addTherapist = async (data) => {
    let response;
    if (data instanceof FormData) {
      response = await api.post('/therapists', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      response = await api.post('/therapists', data);
    }

    if (response.data.success) {
      const newDoc = normalizeItem(response.data.therapist);
      setTherapists((prev) => [newDoc, ...prev]);
      return newDoc;
    }
    throw new Error(response.data.message || 'Failed to add therapist.');
  };

  const updateTherapist = async (id, data) => {
    let response;
    if (data instanceof FormData) {
      response = await api.put(`/therapists/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      response = await api.put(`/therapists/${id}`, data);
    }

    if (response.data.success) {
      const updatedDoc = normalizeItem(response.data.therapist);
      setTherapists((prev) => prev.map((doc) => (doc.id === id ? updatedDoc : doc)));
      return updatedDoc;
    }
    throw new Error(response.data.message || 'Failed to update therapist.');
  };

  const deleteTherapist = async (id) => {
    const response = await api.delete(`/therapists/${id}`);
    if (response.data.success) {
      setTherapists((prev) => prev.filter((doc) => doc.id !== id));
      return true;
    }
    throw new Error(response.data.message || 'Failed to delete therapist.');
  };

  const toggleTherapistStatus = async (id) => {
    const existing = therapists.find((d) => d.id === id);
    if (!existing) return;
    const newStatus = existing.status === 'active' ? 'inactive' : 'active';
    await updateTherapist(id, { status: newStatus });
  };

  const updateTherapistAvailability = async (id, availableDays, availableTime) => {
    const response = await api.put(`/therapists/${id}/availability`, { availableDays, availableTime });
    if (response.data.success) {
      const updatedDoc = normalizeItem(response.data.therapist);
      setTherapists((prev) => prev.map((doc) => (doc.id === id ? updatedDoc : doc)));
      return updatedDoc;
    }
    throw new Error(response.data.message || 'Failed to update availability.');
  };

  // --- Conditions CRUD ---
  const addCondition = async (data) => {
    const response = await api.post('/conditions', data);
    if (response.data.success) {
      const newCond = normalizeItem(response.data.condition);
      setConditions((prev) => [newCond, ...prev]);
      return newCond;
    }
    throw new Error(response.data.message || 'Failed to add condition.');
  };

  const updateCondition = async (id, data) => {
    const response = await api.put(`/conditions/${id}`, data);
    if (response.data.success) {
      const updatedCond = normalizeItem(response.data.condition);
      setConditions((prev) => prev.map((c) => (c.id === id ? updatedCond : c)));
      return updatedCond;
    }
    throw new Error(response.data.message || 'Failed to update condition.');
  };

  const deleteCondition = async (id) => {
    const response = await api.delete(`/conditions/${id}`);
    if (response.data.success) {
      setConditions((prev) => prev.filter((c) => c.id !== id));
      return true;
    }
    throw new Error(response.data.message || 'Failed to delete condition.');
  };

  const toggleConditionStatus = async (id) => {
    const existing = conditions.find((c) => c.id === id);
    if (!existing) return;
    const newStatus = existing.status === 'active' ? 'inactive' : 'active';
    await updateCondition(id, { status: newStatus });
  };

  // --- Appointments CRUD ---
  const addAppointment = async (data) => {
    const response = await api.post('/appointments', data);
    if (response.data.success) {
      const newApp = normalizeItem(response.data.appointment);
      setAppointments((prev) => [newApp, ...prev]);
      return newApp;
    }
    throw new Error(response.data.message || 'Failed to create appointment.');
  };

  const updateAppointmentStatus = async (id, statusData) => {
    const payload = typeof statusData === 'string' ? { status: statusData } : statusData;
    const response = await api.put(`/appointments/${id}/status`, payload);
    if (response.data.success) {
      const updatedApp = normalizeItem(response.data.appointment);
      setAppointments((prev) => prev.map((app) => (app.id === id ? updatedApp : app)));
      return updatedApp;
    }
    throw new Error(response.data.message || 'Failed to update status.');
  };

  const assignTherapist = async (id, therapistId) => {
    const response = await api.put(`/appointments/${id}/assign`, { therapistId });
    if (response.data.success) {
      const updatedApp = normalizeItem(response.data.appointment);
      setAppointments((prev) => prev.map((app) => (app.id === id ? updatedApp : app)));
      return updatedApp;
    }
    throw new Error(response.data.message || 'Failed to assign therapist.');
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    const response = await api.put(`/appointments/${id}/payment-status`, { paymentStatus });
    if (response.data.success) {
      const updatedApp = normalizeItem(response.data.appointment);
      setAppointments((prev) => prev.map((app) => (app.id === id ? updatedApp : app)));
      return updatedApp;
    }
    throw new Error(response.data.message || 'Failed to update payment status.');
  };

  const rescheduleAppointment = async (id, appointmentDate, appointmentTime) => {
    const response = await api.put(`/appointments/${id}/reschedule`, { appointmentDate, appointmentTime });
    if (response.data.success) {
      const updatedApp = normalizeItem(response.data.appointment);
      setAppointments((prev) => prev.map((app) => (app.id === id ? updatedApp : app)));
      return updatedApp;
    }
    throw new Error(response.data.message || 'Failed to reschedule.');
  };

  const deleteAppointment = async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    if (response.data.success) {
      setAppointments((prev) => prev.filter((app) => app.id !== id));
      return true;
    }
    throw new Error(response.data.message || 'Failed to delete appointment.');
  };

  // --- Razorpay Payment API Actions ---
  const createPaymentOrder = async (appointmentId) => {
    const response = await api.post('/payments/create-order', { appointmentId });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to create payment order.');
  };

  const verifyRazorpayPayment = async (payload) => {
    const response = await api.post('/payments/verify', payload);
    if (response.data.success) {
      const updatedApp = normalizeItem(response.data.appointment);
      setAppointments((prev) => prev.map((app) => (app.id === updatedApp.id ? updatedApp : app)));
      return updatedApp;
    }
    throw new Error(response.data.message || 'Payment verification failed.');
  };

  const reportPaymentFailure = async (payload) => {
    try {
      await api.post('/payments/failure', payload);
    } catch (err) {
      console.error('Error reporting payment failure:', err);
    }
  };

  // --- Reviews CRUD ---
  const addReview = async (data) => {
    const response = await api.post('/reviews', data);
    if (response.data.success) {
      const newRev = normalizeItem(response.data.review);
      setReviews((prev) => [newRev, ...prev]);
      return newRev;
    }
    throw new Error(response.data.message || 'Failed to submit review.');
  };

  const approveReview = async (id) => {
    const response = await api.put(`/reviews/${id}/approve`);
    if (response.data.success) {
      const updatedRev = normalizeItem(response.data.review);
      setReviews((prev) => prev.map((r) => (r.id === id ? updatedRev : r)));
      return updatedRev;
    }
    throw new Error(response.data.message || 'Failed to approve review.');
  };

  const featureReview = async (id) => {
    const response = await api.put(`/reviews/${id}/feature`);
    if (response.data.success) {
      const updatedRev = normalizeItem(response.data.review);
      setReviews((prev) => prev.map((r) => (r.id === id ? updatedRev : r)));
      return updatedRev;
    }
    throw new Error(response.data.message || 'Failed to feature review.');
  };

  const deleteReview = async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    if (response.data.success) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      return true;
    }
    throw new Error(response.data.message || 'Failed to delete review.');
  };

  // --- Contact / Inquiries CRUD ---
  const addInquiry = async (data) => {
    const response = await api.post('/contact', data);
    if (response.data.success) {
      const newInq = normalizeItem(response.data.contact);
      setInquiries((prev) => [newInq, ...prev]);
      return newInq;
    }
    throw new Error(response.data.message || 'Failed to submit inquiry.');
  };

  const updateInquiryStatus = async (id, status) => {
    const response = await api.put(`/contact/${id}/status`, { status });
    if (response.data.success) {
      const updatedInq = normalizeItem(response.data.contact);
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? updatedInq : inq)));
      return updatedInq;
    }
    throw new Error(response.data.message || 'Failed to update message status.');
  };

  const deleteInquiry = async (id) => {
    const response = await api.delete(`/contact/${id}`);
    if (response.data.success) {
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      return true;
    }
    throw new Error(response.data.message || 'Failed to delete inquiry.');
  };

  // --- Derived Statistics & Patients List ---
  const stats = useMemo(() => {
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter((a) => a.status === 'Pending').length;
    const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed').length;
    const completedAppointments = appointments.filter((a) => a.status === 'Completed').length;
    const totalTherapists = therapists.length;
    const totalTherapies = therapies.length;
    const pendingReviews = reviews.filter((r) => r.status === 'pending').length;
    const totalMessages = inquiries.length;
    const newMessages = inquiries.filter((m) => m.status === 'New' || !m.isRead).length;

    // Aggregate unique patients
    const patientMap = {};
    appointments.forEach((app) => {
      const key = app.phone || app.email || app.patientName;
      if (!patientMap[key]) {
        patientMap[key] = {
          name: app.patientName,
          phone: app.phone,
          email: app.email,
          age: app.age,
          gender: app.gender,
          appointmentCount: 1,
          lastAppointment: app.appointmentDate || app.date,
          status: 'Active'
        };
      } else {
        patientMap[key].appointmentCount += 1;
        if ((app.appointmentDate || app.date) > patientMap[key].lastAppointment) {
          patientMap[key].lastAppointment = app.appointmentDate || app.date;
        }
      }
    });

    const patients = Object.values(patientMap);
    const approvedReviews = reviews.filter((r) => r.status === 'approved');
    const averageRating = approvedReviews.length
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : '4.9';

    return {
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      totalTherapists,
      totalTherapies,
      totalPatients: patients.length,
      pendingReviews,
      totalMessages,
      newMessages,
      averageRating,
      patients
    };
  }, [appointments, therapists, therapies, reviews, inquiries]);

  return (
    <DataContext.Provider
      value={{
        therapies,
        therapists,
        conditions,
        reviews,
        appointments,
        inquiries,
        settings,
        stats,
        loading,
        refreshData,
        // Handlers
        addTherapy,
        updateTherapy,
        deleteTherapy,
        toggleTherapyStatus,
        addTherapist,
        updateTherapist,
        deleteTherapist,
        toggleTherapistStatus,
        updateTherapistAvailability,
        addCondition,
        updateCondition,
        deleteCondition,
        toggleConditionStatus,
        addAppointment,
        updateAppointmentStatus,
        assignTherapist,
        updatePaymentStatus,
        rescheduleAppointment,
        deleteAppointment,
        createPaymentOrder,
        verifyRazorpayPayment,
        reportPaymentFailure,
        addReview,
        approveReview,
        featureReview,
        deleteReview,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
