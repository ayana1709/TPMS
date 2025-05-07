// DriversWithCarsTable.jsx
import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../api'; // Adjust if needed

const DriversWithCarsTable = () => {
  const queryClient = useQueryClient();
  const [selectedDriver, setSelectedDriver] = React.useState(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  const {
    data,
    isLoading,
    isError,
  } = useQuery(['drivers-with-cars'], async () => {
    const res = await api.get('/drivers/with-cars');
    return res.data;
  });

  const handleApprove = async (driverId) => {
    try {
      await api.patch(`/drivers/${driverId}/approve`);
      queryClient.invalidateQueries(['drivers-with-cars']);
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (driverId) => {
    try {
      await api.patch(`/drivers/${driverId}/reject`);
      queryClient.invalidateQueries(['drivers-with-cars']);
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  const handleDelete = async (driverId) => {
    try {
      await api.delete(`/drivers/${driverId}`);
      queryClient.invalidateQueries(['drivers-with-cars']);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedDriver(null);
    setEditDialogOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/drivers/${selectedDriver.id}`, selectedDriver);
      queryClient.invalidateQueries(['drivers-with-cars']);
      handleCloseEditDialog();
    } catch (error) {
      console.error('Edit error:', error);
    }
  };

  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'firstName', header: 'First Name' },
    { accessorKey: 'lastName', header: 'Last Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'carModel', header: 'Car Model' },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Tooltip title="Approve">
            <IconButton
              color="success"
              onClick={() => handleApprove(row.original.id)}
            >
              <CheckIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton
              color="error"
              onClick={() => handleReject(row.original.id)}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => handleEdit(row.original)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleDelete(row.original.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

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
    <Box>
      <Typography variant="h4" gutterBottom>
        Driver Activation Page
      </Typography>
      <MaterialReactTable table={table} />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Driver</DialogTitle>
        <DialogContent>
          <input
            type="text"
            placeholder="First Name"
            value={selectedDriver?.firstName || ''}
            onChange={(e) =>
              setSelectedDriver({ ...selectedDriver, firstName: e.target.value })
            }
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={selectedDriver?.lastName || ''}
            onChange={(e) =>
              setSelectedDriver({ ...selectedDriver, lastName: e.target.value })
            }
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <input
            type="text"
            placeholder="Email"
            value={selectedDriver?.email || ''}
            onChange={(e) =>
              setSelectedDriver({ ...selectedDriver, email: e.target.value })
            }
            style={{ width: '100%' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriversWithCarsTable;
