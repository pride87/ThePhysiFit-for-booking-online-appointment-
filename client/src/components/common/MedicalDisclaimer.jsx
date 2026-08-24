import React from 'react';
import { AlertTriangle } from 'lucide-react';

const MedicalDisclaimer = ({ text = "Treatment decisions should be made after consultation with a qualified healthcare professional. Information provided is for educational purposes and does not constitute medical diagnosis." }) => {
  return (
    <div className="disclaimer-box" role="alert">
      <AlertTriangle size={18} />
      <span><strong>Medical Disclaimer:</strong> {text}</span>
    </div>
  );
};

export default MedicalDisclaimer;
