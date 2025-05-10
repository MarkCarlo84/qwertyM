import { useState, useEffect } from 'react';
import api from '../api/axios';
import Styles from '../css modules/BudgetTracker.module.css';

export default function BudgetTracker({ projectId }) {
  const [budget, setBudget] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    planned_budget: '',
    actual_cost: '',
    description: ''
  });

  useEffect(() => {
    fetchBudget();
  }, [projectId]);

  const fetchBudget = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/budget`);
      setBudget(response.data);
    } catch (err) {
      setError('Failed to fetch budget information');
      console.error('Error fetching budget:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (budget) {
        // Update existing budget
        await api.put(`/projects/${projectId}/budget`, formData);
      } else {
        // Create new budget
        await api.post(`/projects/${projectId}/budget`, formData);
      }

      setSuccess('Budget information saved successfully!');
      setFormData({
        planned_budget: '',
        actual_cost: '',
        description: ''
      });
      fetchBudget();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget information');
      console.error('Error saving budget:', err);
    }
  };

  const calculateVariance = () => {
    if (!budget) return 0;
    return budget.planned_budget - budget.actual_cost;
  };

  const calculateVariancePercentage = () => {
    if (!budget || budget.planned_budget === 0) return 0;
    return ((budget.actual_cost - budget.planned_budget) / budget.planned_budget) * 100;
  };

  return (
    <div className={Styles.container}>
      <h2>Budget Tracker</h2>
      
      {error && <div className={Styles.error}>{error}</div>}
      {success && <div className={Styles.success}>{success}</div>}

      <form onSubmit={handleSubmit} className={Styles.form}>
        <div className={Styles.formGroup}>
          <label htmlFor="planned_budget">Planned Budget:</label>
          <input
            type="number"
            id="planned_budget"
            name="planned_budget"
            value={formData.planned_budget}
            onChange={handleChange}
            placeholder="Enter planned budget"
            required
          />
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="actual_cost">Actual Cost:</label>
          <input
            type="number"
            id="actual_cost"
            name="actual_cost"
            value={formData.actual_cost}
            onChange={handleChange}
            placeholder="Enter actual cost"
            required
          />
        </div>

        <div className={Styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter budget description"
            required
          />
        </div>

        <button type="submit" className={Styles.submitButton}>
          {budget ? 'Update Budget' : 'Set Budget'}
        </button>
      </form>

      {budget && (
        <div className={Styles.budgetSummary}>
          <h3>Budget Summary</h3>
          <div className={Styles.summaryGrid}>
            <div className={Styles.summaryItem}>
              <span className={Styles.label}>Planned Budget:</span>
              <span className={Styles.value}>${budget.planned_budget.toFixed(2)}</span>
            </div>
            <div className={Styles.summaryItem}>
              <span className={Styles.label}>Actual Cost:</span>
              <span className={Styles.value}>${budget.actual_cost.toFixed(2)}</span>
            </div>
            <div className={Styles.summaryItem}>
              <span className={Styles.label}>Variance:</span>
              <span className={`${Styles.value} ${calculateVariance() < 0 ? Styles.negative : Styles.positive}`}>
                ${calculateVariance().toFixed(2)}
              </span>
            </div>
            <div className={Styles.summaryItem}>
              <span className={Styles.label}>Variance %:</span>
              <span className={`${Styles.value} ${calculateVariancePercentage() > 0 ? Styles.negative : Styles.positive}`}>
                {calculateVariancePercentage().toFixed(2)}%
              </span>
            </div>
          </div>
          <div className={Styles.description}>
            <span className={Styles.label}>Description:</span>
            <p>{budget.description}</p>
          </div>
        </div>
      )}
    </div>
  );
} 