import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';

const PlanSelection = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: 'manufacturer',
    employees: '1-10',
  });

  const navigate = useNavigate();

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Up to 3 users',
        'Basic order management',
        'Email support',
        'Basic analytics',
        '1 warehouse location'
      ],
      popular: false
    },
    {
      id: 'growth',
      name: 'Growth',
      price: { monthly: 45000, yearly: 432000 },
      features: [
        'Up to 20 users',
        'Advanced workflows',
        'Priority support',
        'Advanced analytics',
        'Up to 5 warehouse locations',
        'API access'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 150000, yearly: 1620000 },
      features: [
        'Unlimited users',
        'Custom workflows',
        '24/7 dedicated support',
        'Custom reporting',
        'Unlimited locations',
        'API access',
        'Dedicated success manager'
      ],
      popular: false
    }
  ];

  const businessTypes = [
    { id: 'manufacturer', name: 'Manufacturer' },
    { id: 'distributor', name: 'Distributor' },
    { id: 'retailer', name: 'Retailer' },
    { id: 'other', name: 'Other' },
  ];

  const employeeRanges = [
    '1-10',
    '11-50',
    '51-200',
    '201-1000',
    '1000+'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatRWF = (amount) => {
    if (amount === 0) return 'Free';
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setStep(2);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!businessInfo.name.trim()) newErrors.name = 'Full name is required';
    if (!businessInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(businessInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!businessInfo.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9\-+()\s]+$/.test(businessInfo.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!businessInfo.businessName.trim()) newErrors.businessName = 'Business name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Submitting:', { selectedPlan, billingCycle, ...businessInfo });
      // Redirect to payment or confirmation page
      navigate('/auth/register', { 
        state: { 
          plan: selectedPlan,
          billingCycle,
          ...businessInfo
        } 
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back to Home Button */}
        <div className="mb-6">
    
             <Link 
to="/"                          className="flex items-center space-x-[10px] text-[16px] text-gray-500 hover:text-gray-700"
                        >
                          <ArrowLeft className="w-[24px] h-[24px] text-gray-700 border-[1px] border-gray-300 rounded-[8px] p-[5px]" />
                          <span>Go back to Home</span>
                        </Link>
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Select the plan that's right for your business
          </p>
          
          {step === 1 && (
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    billingCycle === 'monthly' 
                      ? 'bg-white shadow-sm text-[#7152F3]' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    billingCycle === 'yearly' 
                      ? 'bg-white shadow-sm text-[#7152F3]' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Yearly Billing (Save 20%)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= stepNumber 
                        ? 'bg-[#7152F3] text-white' 
                        : 'bg-gray-200 text-gray-600'
                    } font-medium`}
                  >
                    {step > stepNumber ? <Check size={20} /> : stepNumber}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700">
                    {stepNumber === 1 ? 'Select Plan' : stepNumber === 2 ? 'Business Info' : 'Complete'}
                  </span>
                </div>
                {stepNumber < 3 && (
                  <div className="w-16 h-1 mx-2 bg-gray-200 rounded-full"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-xl border ${
                  plan.popular ? 'border-[#7152F3] ring-2 ring-[#7152F3]' : 'border-gray-200'
                } bg-white p-6 shadow-sm`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7152F3] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatRWF(plan.price[billingCycle])}
                  </span>
                  <span className="text-sm text-gray-500">
                    {plan.price === 0 ? '' : `/${billingCycle === 'monthly' ? 'month' : 'year'}`}
                  </span>
                </div>
                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`mt-6 w-full py-2 px-4 rounded-md font-medium ${
                    plan.popular 
                      ? 'bg-[#7152F3] text-white hover:bg-[#5a3fd9]' 
                      : 'text-[#7152F3] border border-[#7152F3] hover:bg-[#7152F3]/5'
                  } transition-colors`}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Business Information */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm0 4h6v2H7V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="businessName"
                      id="businessName"
                      value={businessInfo.businessName}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.businessName ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 shadow-sm focus:ring-[#7152F3] focus:border-[#7152F3]'} rounded-md`}
                      placeholder="Acme Inc."
                    />
                  </div>
                  {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Your Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={businessInfo.name}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 shadow-sm focus:ring-[#7152F3] focus:border-[#7152F3]'} rounded-md`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={businessInfo.email}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 shadow-sm focus:ring-[#7152F3] focus:border-[#7152F3]'} rounded-md`}
                      placeholder="you@company.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={businessInfo.phone}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${errors.phone ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-gray-300 shadow-sm focus:ring-[#7152F3] focus:border-[#7152F3]'} rounded-md`}
                      placeholder="+250 700 000 000"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                    Business Type
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={businessInfo.businessType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-[#7152F3] focus:border-[#7152F3] sm:text-sm rounded-md"
                  >
                    {businessTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="employees" className="block text-sm font-medium text-gray-700">
                    Number of Employees
                  </label>
                  <select
                    id="employees"
                    name="employees"
                    value={businessInfo.employees}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-[#7152F3] focus:border-[#7152F3] sm:text-sm rounded-md"
                  >
                    {employeeRanges.map((range) => (
                      <option key={range} value={range}>
                        {range} {range === '1' ? 'Employee' : 'Employees'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7152F3]"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Plans
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#7152F3] hover:bg-[#5e43d1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7152F3] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                  {!isSubmitting && <ChevronRight size={18} className="ml-2" />}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Success/Confirmation (handled by navigation) */}
      </div>
    </div>
  );
};

export default PlanSelection;
