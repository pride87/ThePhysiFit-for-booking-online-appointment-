import React, { useState } from 'react';
import { DollarSign, Save } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';

const PricingManagement = () => {
  const { therapies, updateTherapy } = useData();
  const { showToast } = useToast();

  const [priceState, setPriceState] = useState(() =>
    therapies.map((t) => ({
      id: t.id,
      name: t.name,
      duration: t.duration,
      price: t.price,
      discountPrice: t.discountPrice || ''
    }))
  );

  const handleChange = (id, field, val) => {
    setPriceState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    priceState.forEach((item) => {
      updateTherapy(item.id, {
        price: parseInt(item.price, 10),
        discountPrice: item.discountPrice ? parseInt(item.discountPrice, 10) : null,
        duration: item.duration
      });
    });
    showToast('Pricing configurations updated successfully across public website!', 'success');
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Session Pricing & Rate Management</h1>
          <p className="admin-page-subtitle">Configure session pricing, promotional rate discounts, and duration limits per therapy modality.</p>
        </div>

        <button className="btn btn-primary" onClick={handleSaveAll}>
          <Save size={18} /> Save All Rates
        </button>
      </div>

      <div className="table-card">
        <form onSubmit={handleSaveAll}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Therapy Modality</th>
                  <th>Session Duration</th>
                  <th>Standard Rate ($)</th>
                  <th>Discount / Promo Rate ($)</th>
                  <th>Effective Charge</th>
                </tr>
              </thead>
              <tbody>
                {priceState.map((item) => {
                  const effective = item.discountPrice ? item.discountPrice : item.price;
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700, color: 'var(--dark)' }}>{item.name}</td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '130px', padding: '0.4rem 0.6rem' }}
                          value={item.duration}
                          onChange={(e) => handleChange(item.id, 'duration', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-input"
                          style={{ width: '110px', padding: '0.4rem 0.6rem' }}
                          value={item.price}
                          onChange={(e) => handleChange(item.id, 'price', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-input"
                          style={{ width: '110px', padding: '0.4rem 0.6rem' }}
                          placeholder="Optional"
                          value={item.discountPrice}
                          onChange={(e) => handleChange(item.id, 'discountPrice', e.target.value)}
                        />
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                        ${effective}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PricingManagement;
