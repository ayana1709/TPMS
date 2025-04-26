import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'react-hot-toast';
import { Textarea } from '../../components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const Fine = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Inside your Fine component, above return(…):
  const [violations, setViolations] = useState([
    { type: '', description: '', amount: '' },
  ]);
  const [formData, setFormData] = useState({
    // Offender Information
    fullName: '',
    address: '',
    contactNumber: '',
    driversLicenseNumber: '',
    vehicleRegistrationNumber: '',
    vehicleType: '',

    // Offense Details
    dateOfOffense: null,
    timeOfOffense: '',
    location: '',
    violationType: '',
    lawViolated: '',
    incidentDescription: '',

    // Fine Details
    totalFineAmount: 0,
    violation1Description: '',
    violation1Amount: 0,
    violation2Description: '',
    violation2Amount: 0,
    additionalFees: 0,
    dueDate: null,
    paymentInstructions: '',

    // Officer Details
    officerName: user?.full_name || '',
    badgeNumber: '',
    policeStation: '',
    officerSignature: '',
  });

  console.log(formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update a violation field
  const handleViolationChange = (index, field, value) => {
    setViolations((prev) => {
      const next = prev.map((vi, i) =>
        i === index ? { ...vi, [field]: value } : vi,
      );
      // Recompute total whenever amounts change
      if (field === 'amount') {
        const sumAmounts = next.reduce(
          (sum, v) => sum + (parseFloat(v.amount) || 0),
          0,
        );
        const additional = parseFloat(formData.additionalFees) || 0;
        setFormData((f) => ({
          ...f,
          totalFineAmount: (sumAmounts + additional).toFixed(2),
        }));
      }
      return next;
    });
  };

  // Add a blank violation
  const addViolation = () =>
    setViolations((prev) => [
      ...prev,
      { type: '', description: '', amount: '' },
    ]);

  // Remove one violation
  const removeViolation = (index) => {
    setViolations((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // Recompute total after removal
      const sumAmounts = next.reduce(
        (sum, v) => sum + (parseFloat(v.amount) || 0),
        0,
      );
      const additional = parseFloat(formData.additionalFees) || 0;
      setFormData((f) => ({
        ...f,
        totalFineAmount: (sumAmounts + additional).toFixed(2),
      }));
      return next;
    });
  };

  // Recompute when additionalFees change
  const handleAdditionalFeesChange = (e) => {
    const value = e.target.value;
    handleInputChange(e); // updates formData.additionalFees
    const sumAmounts = violations.reduce(
      (sum, v) => sum + (parseFloat(v.amount) || 0),
      0,
    );
    setFormData((f) => ({
      ...f,
      totalFineAmount: (sumAmounts + (parseFloat(value) || 0)).toFixed(2),
    }));
  };

  const calculateTotalFine = () => {
    const violation1 = parseFloat(formData.violation1Amount) || 0;
    const violation2 = parseFloat(formData.violation2Amount) || 0;
    const additional = parseFloat(formData.additionalFees) || 0;
    const total = violation1 + violation2 + additional;
    setFormData((prev) => ({
      ...prev,
      totalFineAmount: total.toFixed(2),
    }));
  };

  const handleViolationCodeInput = async (idx, code, offenseType) => {
    const updated = [...violations];
    updated[idx].code = code;

    try {
      const res = await axios.get(
        `/api/traffic-laws/${code}?offense=${offenseType}`,
      );
      const { type, description, amount } = res.data;

      updated[idx].type = type;
      updated[idx].description = description;
      updated[idx].amount = amount;
    } catch (error) {
      console.error('Error fetching violation:', error);
    }

    setViolations(updated);
  };

  const handleOffenseTypeChange = async (idx, offenseType) => {
    const updated = [...violations];
    updated[idx].offenseType = offenseType;

    const code = updated[idx].code;

    if (code) {
      // Refetch with new offense type
      try {
        const res = await axios.get(
          `/api/traffic-laws/${code}?offense=${offenseType}`,
        );
        const { type, description, amount } = res.data;

        updated[idx].type = type;
        updated[idx].description = description;
        updated[idx].amount = amount;
      } catch (error) {
        console.error('Error fetching updated fine:', error);
      }
    }

    setViolations(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Add violations array to the form data before sending
    const data = {
      ...formData,
      violations, // append the violations array here
    };
    console.log(data);

    try {
      const response = await api.post('/violations', data);

      if (response.data.status === 'success') {
        toast.success('Fine recorded successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record fine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="uppercase tracking-wider text-gray-800 font-semibold text-black dark:text-white bg-gray-300 dark:bg-gray-700 p-2 rounded-[5px]">
          Traffic Fine Form
        </h2>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="p-6.5">
          {/* Offender Information */}
          <div className="border p-4 rounded-[10px]">
            <div className="mb-6">
              <h3 className="inline-block px-4 py-2 text-gray-600 uppercase tracking-wider rounded-[5px] mb-4 text-xl bg-gray-200 dark:bg-gray-700 font-semibold text-black dark:text-white">
                Offender Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 border p-4 rounded-[5px]">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="block rounded-[5px]"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="block rounded-[5px]"
                  />
                </div>
                <div>
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                    className="block rounded-[5px]"
                  />
                </div>
                <div>
                  <Label htmlFor="driversLicenseNumber">
                    Driver's License Number
                  </Label>
                  <Input
                    id="driversLicenseNumber"
                    name="driversLicenseNumber"
                    value={formData.driversLicenseNumber}
                    onChange={handleInputChange}
                    required
                    className="block rounded-[5px]"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleRegistrationNumber">
                    Vehicle Registration Number
                  </Label>
                  <Input
                    id="vehicleRegistrationNumber"
                    name="vehicleRegistrationNumber"
                    value={formData.vehicleRegistrationNumber}
                    onChange={handleInputChange}
                    required
                    className="block rounded-[5px]"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) =>
                      handleSelectChange('vehicleType', value)
                    }
                  >
                    <SelectTrigger className="rounded-[5px]">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Offense Details */}
          <div className="my-6 p-4 border rounded-[10px]">
            <div className="">
              <h3 className="bg-gray-300 text-gray-600 uppercase tracking-wider inline-block px-4 rounded-[5px] py-2 mb-4 dark:bg-gray-700 text-xl font-semibold text-black dark:text-white">
                Offense Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 border p-4 rounded-[5px]">
                <div>
                  <Label htmlFor="timeOfOffense">Time of Offense</Label>
                  <Input type="date" className="block rounded-[5px]" />
                </div>

                <div>
                  <Label htmlFor="timeOfOffense">Time of Offense</Label>
                  <Input
                    type="time"
                    id="timeOfOffense"
                    name="timeOfOffense"
                    value={formData.timeOfOffense}
                    onChange={handleInputChange}
                    required
                    className="block rounded-[5px]"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Street name or GPS coordinates"
                    required
                    className="block rounded-[5px]"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="incidentDescription">
                    Incident Description
                  </Label>
                  <Textarea
                    id="incidentDescription"
                    name="incidentDescription"
                    value={formData.incidentDescription}
                    onChange={handleInputChange}
                    placeholder="Provide a brief description of the incident"
                    className="h-32 rounded-[5px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fine Details */}
          {/* …inside your JSX, replacing the previous fine details block… */}

          <div className="my-6 border p-4 rounded-[10px]">
            <h3 className="mb-4 text-xl font-semibold inline-block px-4 py-2 rounded-[5px] bg-gray-300">
              Fine Details
            </h3>

            {violations.map((violation, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 gap-4 md:grid-cols-6 p-4 border rounded-[5px] mb-4 relative"
              >
                {/* Violation Code */}
                <div>
                  <Label htmlFor={`violationCode-${idx}`}>Violation Code</Label>
                  <Input
                    id={`violationCode-${idx}`}
                    value={violation.code || ''}
                    onChange={(e) =>
                      handleViolationCodeInput(
                        idx,
                        e.target.value,
                        violation.offenseType || 'first',
                      )
                    }
                    placeholder="Enter code"
                    className="rounded-[5px]"
                  />
                </div>

                {/* Offense Type */}
                <div>
                  <Label htmlFor={`offenseType-${idx}`}>Offense Type</Label>
                  <select
                    id={`offenseType-${idx}`}
                    value={violation.offenseType || 'first'}
                    onChange={(e) =>
                      handleOffenseTypeChange(idx, e.target.value)
                    }
                    className="rounded-[5px] w-full h-[40px] border px-2"
                  >
                    <option value="first">First-time</option>
                    <option value="second">Second-time</option>
                  </select>
                </div>

                {/* Violation Type - text input */}
                <div>
                  <Label htmlFor={`violationType-${idx}`}>Violation Type</Label>
                  <Input
                    id={`violationType-${idx}`}
                    value={violation.type || ''}
                    onChange={(e) =>
                      handleViolationChange(idx, 'type', e.target.value)
                    }
                    placeholder="Enter type"
                    className="rounded-[5px]"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor={`violationDesc-${idx}`}>
                    Violation {idx + 1} Law
                  </Label>
                  <Input
                    id={`violationDesc-${idx}`}
                    value={violation.description || ''}
                    onChange={(e) =>
                      handleViolationChange(idx, 'description', e.target.value)
                    }
                    placeholder="Search or enter description"
                    className="rounded-[5px]"
                  />
                </div>

                {/* Amount */}
                <div>
                  <Label htmlFor={`violationAmt-${idx}`}>
                    Violation {idx + 1} Amount
                  </Label>
                  <Input
                    type="number"
                    id={`violationAmt-${idx}`}
                    value={violation.amount || ''}
                    onChange={(e) =>
                      handleViolationChange(idx, 'amount', e.target.value)
                    }
                    min="0"
                    className="rounded-[5px]"
                  />
                </div>

                {/* Remove */}
                {violations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeViolation(idx)}
                    className="self-start text-red-600 hover:underline mt-6"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={addViolation}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                + Add Violation
              </button>
            </div>

            {/* Additional Fees */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4 border rounded-[5px] mb-4">
              <div>
                <Label htmlFor="additionalFees">Additional Fees</Label>
                <Input
                  type="number"
                  id="additionalFees"
                  name="additionalFees"
                  value={formData.additionalFees}
                  onChange={handleAdditionalFeesChange}
                  min="0"
                  className="block rounded-[5px]"
                />
              </div>

              {/* Due Date */}
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate || ''}
                  onChange={handleInputChange}
                  className="block rounded-[5px]"
                />
              </div>
            </div>

            {/* Display Total */}
            <div className="p-4 border rounded-[5px] mb-4">
              <Label>Total Fine Amount</Label>
              <div className="mt-1 text-xl font-bold">
                ${formData.totalFineAmount}
              </div>
            </div>
          </div>

          {/* Officer Details */}
          <div className="border p-4 rounded-[10px]">
            <div className="mb-6">
              <h3 className="mb-4 text-xl font-semibold text-black dark:bg-gray-700 inline-block rounded-md px-4 py-2 rounded-md dark:text-white">
                Officer Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 rounded-[5px] border p-4">
                <div>
                  <Label htmlFor="officerName">Officer Name</Label>
                  <Input
                    id="officerName"
                    name="officerName"
                    value={formData.officerName}
                    onChange={handleInputChange}
                    required
                    disabled
                    className="block rounded-[5px]"
                  />
                </div>
                <div>
                  <Label htmlFor="badgeNumber">Badge Number</Label>
                  <Input
                    id="badgeNumber"
                    name="badgeNumber"
                    value={formData.badgeNumber}
                    onChange={handleInputChange}
                    required
                    className="block rounded-[5px]"
                  />
                </div>
                <div>
                  <Label htmlFor="policeStation">Police Station</Label>
                  <Input
                    id="policeStation"
                    name="policeStation"
                    value={formData.policeStation}
                    onChange={handleInputChange}
                    required
                    className="block rounded-[5px]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4.5 my-4">
            <button
              className="bg-gray-200 py-2 px-4 rounded-[5px] hover:bg-gray-500 hover:text-white transition-all duration-300"
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  // Reset all fields to initial state
                  fullName: '',
                  address: '',
                  contactNumber: '',
                  driversLicenseNumber: '',
                  vehicleRegistrationNumber: '',
                  vehicleType: '',
                  dateOfOffense: null,
                  timeOfOffense: '',
                  location: '',
                  violationType: '',
                  lawViolated: '',
                  incidentDescription: '',
                  totalFineAmount: 0,
                  violation1Description: '',
                  violation1Amount: 0,
                  violation2Description: '',
                  violation2Amount: 0,
                  additionalFees: 0,
                  dueDate: null,
                  paymentInstructions: '',
                  officerName: user?.full_name || '',
                  badgeNumber: '',
                  policeStation: '',
                  officerSignature: '',
                })
              }
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 py-2 px-4 text-white rounded-[5px] hover:bg-blue-800 transition-all duration-300"
            >
              {loading ? 'Recording...' : 'Record Fine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Fine;
