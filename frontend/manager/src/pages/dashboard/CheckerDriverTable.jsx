import React, { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';
import { Button, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import api from '@/api';

const fetchDriversWithCars = async () => {
  const response = await api.get('/drivers');
  return response.data.data;
};

const DriversWithCarsTable = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['drivers-with-cars'],
    queryFn: fetchDriversWithCars,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'full_name',
        header: 'Full Name',
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'region',
        header: 'Region',
      },
      {
        accessorKey: 'zone',
        header: 'Zone',
      },
      {
        accessorKey: 'wereda',
        header: 'Wereda',
      },
      {
        accessorKey: 'license_number',
        header: 'License Number',
      },
      {
        accessorKey: 'car.plate_number',
        header: 'Car Plate',
      },
      {
        accessorKey: 'car.model',
        header: 'Car Model',
      },
      {
        accessorKey: 'car.vin',
        header: 'VIN',
      },
      {
        accessorKey: 'car.chasis_number',
        header: 'Chasis Number',
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <IconButton color="success" onClick={() => console.log('Approve', row.original)}>
          <CheckIcon />
        </IconButton>
        <IconButton color="error" onClick={() => console.log('Reject', row.original)}>
          <ClearIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => console.log('View', row.original)}>
          <VisibilityIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => console.log('Edit', row.original)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => console.log('Delete', row.original)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
    initialState: { pagination: { pageSize: 5 } },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return <MaterialReactTable table={table} />;
};

export default DriversWithCarsTable;
