const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// Helper to aggregate unique patient profiles from appointment list
const aggregatePatientList = (appointmentsList) => {
  const patientMap = {};

  appointmentsList.forEach((app) => {
    const key = app.phone || app.email || app.patientName;
    if (!patientMap[key]) {
      patientMap[key] = {
        name: app.patientName,
        phone: app.phone,
        email: app.email,
        age: app.age,
        gender: app.gender,
        appointmentCount: 1,
        lastAppointment: app.appointmentDate,
        upcomingAppointment: app.status === 'Confirmed' || app.status === 'Pending' ? `${app.appointmentDate} at ${app.appointmentTime}` : null,
        status: 'Active'
      };
    } else {
      patientMap[key].appointmentCount += 1;
      if (app.appointmentDate > patientMap[key].lastAppointment) {
        patientMap[key].lastAppointment = app.appointmentDate;
      }
      if (!patientMap[key].upcomingAppointment && (app.status === 'Confirmed' || app.status === 'Pending')) {
        patientMap[key].upcomingAppointment = `${app.appointmentDate} at ${app.appointmentTime}`;
      }
    }
  });

  return Object.values(patientMap);
};

// 1. THERAPIST API: GET /api/therapist/patients (Only patients associated with this therapist's appointments)
router.get('/therapist/patients', authenticateUser, authorizeRole('therapist', 'admin'), async (req, res) => {
  try {
    let targetTherapistId = req.user.therapistId;

    if (req.user.role === 'therapist') {
      if (!targetTherapistId) {
        return res.status(403).json({ success: false, message: 'No therapist ID linked to this account.' });
      }
    } else if (req.user.role === 'admin' && req.query.therapistId) {
      targetTherapistId = req.query.therapistId;
    }

    const therapistApps = await Appointment.find({ therapistId: targetTherapistId }).sort({ appointmentDate: -1 });
    const patients = aggregatePatientList(therapistApps);

    return res.json({ success: true, therapistId: targetTherapistId, patients });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching therapist patients: ' + err.message });
  }
});

// 2. ADMIN API: GET /api/patients (All patients)
router.get('/patients', authenticateUser, authorizeRole('admin', 'receptionist'), async (req, res) => {
  try {
    const allApps = await Appointment.find().sort({ appointmentDate: -1 });
    const patients = aggregatePatientList(allApps);

    return res.json({ success: true, patients });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching patients: ' + err.message });
  }
});

module.exports = router;
