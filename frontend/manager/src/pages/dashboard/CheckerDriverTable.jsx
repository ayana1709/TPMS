import React, { useState, useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  IconButton,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import Swal from 'sweetalert2';

// import api from './api'; // Adjust the import path as needed

const fetchDrivers = async () => {
  const response = await api.get('/drivers');
  console.log(response.data.data); // Log to confirm
  return response.data.data; // Return only the driver list
};


const DriversWithCarsTable = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
  });

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleView = (driver) => {
    setSelectedDriver(driver);
    setViewDialogOpen(true);
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action will delete the driver.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        await api.delete(`/drivers/${id}`);
        queryClient.invalidateQueries({ queryKey: ['drivers'] });
        Swal.fire('Deleted!', 'Driver has been deleted.', 'success');
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };
  
 

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Approve Driver?',
      text: 'This will approve the driver.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        await api.patch(`/drivers/${id}/approve`);
        queryClient.invalidateQueries({ queryKey: ['drivers'] });
        Swal.fire('Approved!', 'Driver approved successfully.', 'success');
      } catch (error) {
        console.error('Approve error:', error);
        Swal.fire('Error!', 'Approval failed.', 'error');
      }
    }
  };
  

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Reject Driver?',
      text: 'This will reject the driver.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        await api.patch(`/drivers/${id}/reject`);
        queryClient.invalidateQueries({ queryKey: ['drivers'] });
        Swal.fire('Rejected!', 'Driver rejected successfully.', 'success');
      } catch (error) {
        console.error('Reject error:', error);
        Swal.fire('Error!', 'Rejection failed.', 'error');
      }
    }
  };
  

  const handleSaveEdit = async () => {
    try {
      await api.put(`/drivers/${selectedDriver.id}`, selectedDriver);
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  const columns = useMemo(
    () => [
      {accessorkey: 'id', header: 'ID'},
      { accessorKey: 'full_name', header: 'Full Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'phone_number', header: 'Phone' },
      { accessorKey: 'region', header: 'Region' },
      { accessorKey: 'zone', header: 'Zone' },
      { accessorKey: 'wereda', header: 'Wereda' },
      { accessorKey: 'license_number', header: 'License Number' },
      { accessorKey: 'car.plate_number', header: 'Car Plate' },
      { accessorKey: 'car.model', header: 'Car Model' },
      {
        header: 'Actions',
        id: 'actions',
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Tooltip title="Approve">
              <IconButton color="success" onClick={() => handleApprove(row.original.id)}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject">
              <IconButton color="error" onClick={() => handleReject(row.original.id)}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View">
              <IconButton color="primary" onClick={() => handleView(row.original)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton color="secondary" onClick={() => handleEdit(row.original)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

 
  
// Material react table setup 
  const table = useMaterialReactTable({
    columns,
    data: data || [],
    state: {
      isLoading,
      showColumnFilters: true,
    },
    enableColumnFilters: true,
    enableColumnOrdering: true,
    enableColumnVisibility: true,
    initialState: { pagination: { pageSize: 5 } },
  });

  if (isError) return <Typography color="error">Failed to load drivers.</Typography>;

  return (
    <>
      <MaterialReactTable table={table} />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Driver and Car Information</DialogTitle>
        <DialogContent dividers>
          {selectedDriver && (
            <>
              <Typography variant="h6" gutterBottom>
                Driver Info
              </Typography>
              <Typography><strong>Name:</strong> {selectedDriver.full_name}</Typography>
              <Typography><strong>Email:</strong> {selectedDriver.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedDriver.phone_number}</Typography>
              <Typography><strong>Region:</strong> {selectedDriver.region}</Typography>
              <Typography><strong>Zone:</strong> {selectedDriver.zone}</Typography>
              <Typography><strong>Wereda:</strong> {selectedDriver.wereda}</Typography>
              <Typography><strong>License Number:</strong> {selectedDriver.license_number}</Typography>

              <Typography variant="h6" mt={2} gutterBottom>
                Car Info
              </Typography>
              <Typography><strong>Plate Number:</strong> {selectedDriver.car?.plate_number}</Typography>
              <Typography><strong>Model:</strong> {selectedDriver.car?.model}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Driver</DialogTitle>
        <DialogContent dividers>
          {selectedDriver && (
            <>
              <TextField
                label="Full Name"
                value={selectedDriver.full_name}
                onChange={(e) => setSelectedDriver({ ...selectedDriver, full_name: e.target.value })}
                fullWidth
                margin="normal"
              />
               <TextField
                label="Email"
                value={selectedDriver.email}
                onChange={(e) => setSelectedDriver({ ...selectedDriver, email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                value={selectedDriver.phone_number}
                onChange={(e) => setSelectedDriver({ ...selectedDriver, phone_number: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Region"
                value={selectedDriver.region}
                onChange={(e) => setSelectedDriver({ ...selectedDriver, region: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Zone"
                value={selectedDriver.zone}
                onChange={(e) => setSelectedDriver({ ...selectedDriver, zone: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Wereda"
                value={selectedDriver.wereda}
                onChange={(e) => setSelectedDriver({ ...selectedDriver, wereda: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="License Number"
                value={selectedDriver.license_number}
                onChange={(e) => setSelectedDriver({ ...selectedDriver, license_number: e.target.value })}
                fullWidth
                margin="normal"
              />
              {/* Optional: Edit car info too */}
              {selectedDriver.car && (
                <>
                  <TextField
                    label="Car Plate Number"
                    value={selectedDriver.car.plate_number}
                    onChange={(e) =>
                      setSelectedDriver({
                        ...selectedDriver,
                        car: { ...selectedDriver.car, plate_number: e.target.value },
                      })
                    }
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Car Model"
                    value={selectedDriver.car.model}
                    onChange={(e) =>
                      setSelectedDriver({
                        ...selectedDriver,
                        car: { ...selectedDriver.car, model: e.target.value },
                      })
                    }
                    fullWidth
                    margin="normal"
                  />
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DriversWithCarsTable;
