import React from 'react';
import { Drawer, Typography, Divider, Box } from '@mui/material';

const ViewDriverDrawer = ({ open, onClose, driver }) => {
  if (!driver) return null;

  const baseUrl = "http://your-api-url.com/storage/"; // Update to your actual base URL

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 3 }}>
        <Typography variant="h6" gutterBottom>Driver Information</Typography>
        <Typography><strong>Full Name:</strong> {driver.full_name}</Typography>
        <Typography><strong>Email:</strong> {driver.email}</Typography>
        <Typography><strong>Phone:</strong> {driver.phone_number}</Typography>
        <Typography><strong>Region:</strong> {driver.region}</Typography>
        <Typography><strong>Zone:</strong> {driver.zone}</Typography>
        <Typography><strong>Wereda:</strong> {driver.wereda}</Typography>
        <Typography><strong>License Number:</strong> {driver.license_number}</Typography>
        <Typography mt={1}><strong>License Image:</strong></Typography>
        <img
          src={baseUrl + driver.driver_license_path}
          alt="Driver License"
          width="100%"
          style={{ marginBottom: 20 }}
        />

        <Divider />

        <Typography variant="h6" gutterBottom mt={2}>Car Information</Typography>
        <Typography><strong>Plate Number:</strong> {driver.car.plate_number}</Typography>
        <Typography><strong>VIN:</strong> {driver.car.vin}</Typography>
        <Typography><strong>Model:</strong> {driver.car.model}</Typography>
        <Typography><strong>Chassis Number:</strong> {driver.car.chasis_number}</Typography>
        <Typography mt={1}><strong>Car Ownership:</strong></Typography>
        <img
          src={baseUrl + driver.car.car_ownership_path}
          alt="Car Ownership"
          width="100%"
          style={{ marginBottom: 10 }}
        />
        <Typography><strong>Car Bollo:</strong></Typography>
        <img
          src={baseUrl + driver.car.car_bollo_path}
          alt="Car Bollo"
          width="100%"
        />
      </Box>
    </Drawer>
  );
};

export default ViewDriverDrawer;
