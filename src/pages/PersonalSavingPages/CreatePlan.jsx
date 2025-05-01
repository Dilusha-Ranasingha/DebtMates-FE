import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, Plane, Ambulance, GraduationCap, Home, Car } from "lucide-react";
import { Calendar } from 'primereact/calendar';
import { Slider } from 'primereact/slider';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { createSavingPlan } from '../../services/api';

const CreatePlan = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
      planName: '',
      planType: '',
      goalAmount: '',
      startDate: null,
      endDate: null,
      initialDeposit: '',
      frequency: ''
    });
    const toast = useRef(null);

    const navigate = useNavigate();

    const planTypes = [
      { icon: <PiggyBank />, name: 'Emergency Fund' },
      { icon: <Plane />, name: 'Vacation' },
      { icon: <Ambulance />, name: 'Medical' },
      { icon: <GraduationCap />, name: 'Education' },
      { icon: <Home />, name: 'Housing' },
      { icon: <Car />, name: 'Vehicle' }
    ];

    const frequencyOptions = [
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Bi-weekly', value: 'biweekly' },
      { label: 'Monthly', value: 'monthly' }
    ];

    const validateStep = (step) => {
        const newErrors = {};
        
        switch(step) {
            case 1:
                if (!formData.planName.trim()) {
                    newErrors.planName = 'Plan name is required';
                }
                if (!formData.planType) {
                    newErrors.planType = 'Please select a plan type';
                }
                break;
            case 2:
                if (!formData.startDate) {
                    newErrors.startDate = 'Start date is required';
                }
                if (!formData.endDate) {
                    newErrors.endDate = 'End date is required';
                }
                if (formData.endDate && formData.startDate && formData.endDate <= formData.startDate) {
                    newErrors.endDate = 'End date must be after start date';
                }
                if (!formData.initialDeposit) {
                    newErrors.initialDeposit = 'Initial deposit is required';
                } else if (parseFloat(formData.initialDeposit) < 0) {
                    newErrors.initialDeposit = 'Initial deposit cannot be negative';
                } else if (parseFloat(formData.initialDeposit) > formData.goalAmount) {
                    newErrors.initialDeposit = 'Initial deposit cannot exceed goal amount';
                }
                break;
            case 3:
                if (!formData.frequency) {
                    newErrors.frequency = 'Please select a deposit frequency';
                }
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fix the errors before continuing',
                life: 3000,
                style: { 
                    border: '2px solid #ef4444',
                    background: '#fee2e2',
                    color: '#991b1b'
                }
            });
        }
    };

    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
      if (validateStep(currentStep)) {
        const planTypeMapping = {
          'Emergency Fund': 'emergency',
          'Vacation': 'vacation',
          'Medical': 'medical',
          'Education': 'education',
          'Housing': 'housing',
          'Vehicle': 'vehicle'
        };

        const payload = {
          planName: formData.planName,
          planType: planTypeMapping[formData.planType] || formData.planType.toLowerCase(),
          goalAmount: parseFloat(formData.goalAmount),
          startDate: formData.startDate.toISOString().split('T')[0],
          endDate: formData.endDate.toISOString().split('T')[0],
          initialDeposit: parseFloat(formData.initialDeposit) || 0,
          depositFrequency: formData.frequency,
          userId: 1, // Replace with actual user ID from auth later
        };

        console.log("Submitting payload:", payload);

        try {
          const response = await createSavingPlan(payload);
          console.log("API Response:", response);
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: `Plan "${formData.planName}" created successfully!`,
            life: 3000,
            style: {
              border: '2px solid #22c55e',
              background: '#dcfce7',
              color: '#166534',
            },
          });
          setTimeout(() => {
            navigate('/personal-saving');
          }, 2000);
        } catch (error) {
          console.error("Error creating plan:", error.response?.data || error.message);
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to create plan',
            life: 3000,
            style: {
              border: '2px solid #ef4444',
              background: '#fee2e2',
              color: '#991b1b',
            },
          });
        }
      }
    };

    const renderStep = () => {
      switch(currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g., Dream Vacation Fund"
                  className={`w-full p-2 border rounded ${errors.planName ? 'border-red-500' : ''}`}
                  value={formData.planName}
                  onChange={e => setFormData({...formData, planName: e.target.value})}
                />
                {errors.planName && <p className="text-red-500 text-sm mt-1">{errors.planName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Plan Type</label>
                <div className="grid grid-cols-3 gap-4">
                  {planTypes.map(type => (
                    <button
                      key={type.name}
                      className={`p-4 border rounded flex flex-col items-center ${
                        formData.planType === type.name ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setFormData({...formData, planType: type.name})}
                    >
                      <span className="text-2xl mb-2">{type.icon}</span>
                      <span>{type.name}</span>
                    </button>
                  ))}
                </div>
                {errors.planType && <p className="text-red-500 text-sm mt-1">{errors.planType}</p>}
              </div>
            </div>
          );
        case 2:
            return (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Goal Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2">Rs.</span>
                  <input
                    type="number"
                    className={`w-full p-2 pl-8 border rounded ${errors.goalAmount ? 'border-red-500' : ''}`}
                    value={formData.goalAmount}
                    onChange={e => setFormData({...formData, goalAmount: e.target.value})}
                    min="1000"
                    placeholder="Enter your goal amount"
                  />
                </div>
                {errors.goalAmount && <p className="text-red-500 text-sm mt-1">{errors.goalAmount}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                type="date"
                className={`w-full p-2 border rounded mb-2 ${errors.startDate ? 'border-red-500' : ''}`}
                value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                onChange={e => setFormData({...formData, startDate: new Date(e.target.value)})}
                min={new Date().toISOString().split('T')[0]}
                />
                <Calendar
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.value})}
                minDate={new Date()}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                type="date"
                className={`w-full p-2 border rounded mb-2 ${errors.endDate ? 'border-red-500' : ''}`}
                value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                onChange={e => setFormData({...formData, endDate: new Date(e.target.value)})}
                min={formData.startDate ? formData.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                />
                <Calendar
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.value})}
                minDate={formData.startDate || new Date()}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
              </div>
              <div>
              <label className="block text-sm font-medium mb-2">Initial Deposit</label>
              <div className="relative">
                <span className="absolute left-3 top-2">Rs.</span>
                <input
                type="number"
                className={`w-full p-2 pl-8 border rounded ${errors.initialDeposit ? 'border-red-500' : ''}`}
                value={formData.initialDeposit}
                onChange={e => setFormData({...formData, initialDeposit: e.target.value})}
                min="100"
                />
                {errors.initialDeposit && <p className="text-red-500 text-sm mt-1">{errors.initialDeposit}</p>}
              </div>
              </div>
            </div>
            );
        case 3:
            return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium mb-2">Deposit Frequency</label>
                <Dropdown
                options={frequencyOptions}
                value={formData.frequency}
                onChange={e => setFormData({...formData, frequency: e.value})}
                className={`w-full p-2 border rounded ${errors.frequency ? 'border-red-500' : ''}`}
                />
                {errors.frequency && <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>}
              </div>
              <div>
                <h3 className="text-sm font-medium mb-4">Summary</h3>
                <div className="space-y-2">
                <p>Goal Amount: Rs. {formData.goalAmount}</p>
                <p>Initial Deposit: Rs. {formData.initialDeposit || 0}</p>
                <p>Duration: {formData.startDate && formData.endDate ? 
                   `${Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24))} days` : 'Not set'}</p>
                </div>
              </div>
              </div>
            </div>
            );
        default:
          return null;
      }
    };

    return (
      <div className="max-w-2xl mx-auto p-6">
        <Toast ref={toast} />
        
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step < currentStep ? 'bg-green-500 text-white' :
                  step === currentStep ? 'bg-blue-500 text-white' :
                  'bg-gray-200'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </div>
            ))}
          </div>
          <div className="relative mt-2 h-2 bg-gray-200 rounded">
            <div
              className="absolute h-full bg-blue-500 rounded"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep(1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <div>
            {currentStep > 1 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Create Plan
              </button>
            )}
          </div>
        </div>
      </div>
    );
};

export default CreatePlan;