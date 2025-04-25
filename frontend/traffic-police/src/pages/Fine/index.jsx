import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { Button } from '../../components/ui/button';
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
import DatePicker from '@/components/DatePicker';

import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const Fine = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleDateChange = (date, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: date,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/violations', {
        ...formData,
        totalFineAmount: formData.totalFineAmount,
      });

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
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Traffic Fine Form
        </h2>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="p-6.5">
          {/* Offender Information */}
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Offender Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          {/* Offense Details */}
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Offense Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DatePicker date={date} setDate={setDate} />

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
              <div>
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
              <div>
                <Label htmlFor="violationType">Violation Type</Label>
                <Select
                  value={formData.violationType}
                  onValueChange={(value) =>
                    handleSelectChange('violationType', value)
                  }
                >
                  <SelectTrigger className="rounded-[5px]">
                    <SelectValue placeholder="Select violation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="speeding">Speeding</SelectItem>
                    <SelectItem value="signal_jump">Signal Jump</SelectItem>
                    <SelectItem value="no_helmet">No Helmet</SelectItem>
                    <SelectItem value="drunk_driving">Drunk Driving</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lawViolated">Law Violated</Label>
                <Input
                  id="lawViolated"
                  name="lawViolated"
                  value={formData.lawViolated}
                  onChange={handleInputChange}
                  placeholder="Legal section number or code"
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

          {/* Fine Details */}
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Fine Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="violation1Description">
                  Violation 1 Description
                </Label>
                <Input
                  id="violation1Description"
                  name="violation1Description"
                  value={formData.violation1Description}
                  onChange={handleInputChange}
                  required
                  className="block rounded-[5px]"
                />
              </div>
              <div>
                <Label htmlFor="violation1Amount">Violation 1 Amount</Label>
                <Input
                  type="number"
                  id="violation1Amount"
                  name="violation1Amount"
                  value={formData.violation1Amount}
                  onChange={handleInputChange}
                  onBlur={calculateTotalFine}
                  min="0"
                  required
                  className="block rounded-[5px]"
                />
              </div>
              <div>
                <Label htmlFor="violation2Description">
                  Violation 2 Description (if applicable)
                </Label>
                <Input
                  id="violation2Description"
                  name="violation2Description"
                  value={formData.violation2Description}
                  onChange={handleInputChange}
                  className="block rounded-[5px]"
                />
              </div>
              <div>
                <Label htmlFor="violation2Amount">Violation 2 Amount</Label>
                <Input
                  type="number"
                  id="violation2Amount"
                  name="violation2Amount"
                  value={formData.violation2Amount}
                  onChange={handleInputChange}
                  onBlur={calculateTotalFine}
                  min="0"
                  className="block rounded-[5px]"
                />
              </div>
              <div>
                <Label htmlFor="additionalFees">Additional Fees</Label>
                <Input
                  type="number"
                  id="additionalFees"
                  name="additionalFees"
                  value={formData.additionalFees}
                  onChange={handleInputChange}
                  onBlur={calculateTotalFine}
                  min="0"
                  className="block rounded-[5px]"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <DatePicker
                  selected={formData.dueDate}
                  onSelect={(date) => handleDateChange(date, 'dueDate')}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="paymentInstructions">
                  Payment Instructions
                </Label>
                <Textarea
                  id="paymentInstructions"
                  name="paymentInstructions"
                  value={formData.paymentInstructions}
                  onChange={handleInputChange}
                  placeholder="Enter payment instructions"
                  className="h-24 rounded-[5px]"
                />
              </div>
            </div>
          </div>

          {/* Officer Details */}
          <div className="mb-6">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Officer Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <div>
                <Label htmlFor="officerSignature">Officer Signature</Label>
                <Input
                  id="officerSignature"
                  name="officerSignature"
                  value={formData.officerSignature}
                  onChange={handleInputChange}
                  placeholder="Digital signature or ID"
                  required
                  className="block rounded-[5px]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4.5">
            <Button
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
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Recording...' : 'Record Fine'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Fine;
