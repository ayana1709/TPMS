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

const Fine = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    driver_id: '',
    car_id: '',
    rule_id: '',
    penalty_amount: '',
    signed: false,
    paid: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/violations', {
        ...formData,
        officer_id: user.id,
        signed: false,
        paid: false,
      });

      if (response.data.status === 'success') {
        toast.success('Fine recorded successfully');
        setFormData({
          driver_id: '',
          car_id: '',
          rule_id: '',
          penalty_amount: '',
          signed: false,
          paid: false,
        });
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
          Fine Management
        </h2>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Record New Fine
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6.5">
          <div className="mb-4.5 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="w-full">
              <Label htmlFor="driver_id">Driver ID</Label>
              <Input
                type="text"
                id="driver_id"
                name="driver_id"
                value={formData.driver_id}
                onChange={handleInputChange}
                placeholder="Enter driver ID"
                required
              />
            </div>

            <div className="w-full">
              <Label htmlFor="car_id">Car ID</Label>
              <Input
                type="text"
                id="car_id"
                name="car_id"
                value={formData.car_id}
                onChange={handleInputChange}
                placeholder="Enter car ID"
                required
              />
            </div>

            <div className="w-full">
              <Label htmlFor="rule_id">Violation Type</Label>
              <Select
                value={formData.rule_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, rule_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select violation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Speeding</SelectItem>
                  <SelectItem value="2">Running Red Light</SelectItem>
                  <SelectItem value="3">Illegal Parking</SelectItem>
                  <SelectItem value="4">No Seat Belt</SelectItem>
                  <SelectItem value="5">Drunk Driving</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label htmlFor="penalty_amount">Penalty Amount (Birr)</Label>
              <Input
                type="number"
                id="penalty_amount"
                name="penalty_amount"
                value={formData.penalty_amount}
                onChange={handleInputChange}
                placeholder="Enter penalty amount"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4.5">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  driver_id: '',
                  car_id: '',
                  rule_id: '',
                  penalty_amount: '',
                  signed: false,
                  paid: false,
                })
              }
            >
              Clear
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
