import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Fab,
  Chip,
  Snackbar,
  Alert
 } from '@mui/material';
import { getAllDonors } from '../api/donors';
import dayjs from 'dayjs';
import EditCategoryDialog from '../Category/EditCategoryDialog';
import CreateCategoryDialog from '../Category/CreateCategoryDialog';
import DeleteConfirmDialog from '../Category/DeleteConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { red } from '@mui/material/colors';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'first_name', label: 'First Name', minWidth: 150 },
  { id: 'last_name', label: 'Last Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 100 },
  { id: 'contact_no', label: 'Contact', minWidth: 100},
  { id: 'pan_number', label: 'PAN No.', minWidth: 100},
  { id: 'address_line_1', label: 'Address Line 1', minWidth: 200 },
  { id: 'address_line_2', label: 'Address Line 2', minWidth: 200 },
  { id: 'city', label: 'City', minWidth: 100 },
  { id: 'state', label: 'State', minWidth: 100 },
  { id: 'pincode', label: 'Pincode', minWidth: 100 },
  { id: 'created_at', label: 'Created At', minWidth: 100, format: (value) => dayjs(value).format('DD-MM-YYYY HH:mm:ss') },
  { id: 'created_by_user_id', label: 'Created By', minWidth: 100 },
  { id: 'updated_at', label: 'Updated At', minWidth: 100, format: (value) => dayjs(value).format('DD-MM-YYYY HH:mm:ss') },
  { id: 'updated_by_user_id', label: 'Updated By', minWidth: 100 },
  { id: 'deleted_at', label: 'Deleted At', minWidth: 100, format: (value) => dayjs(value).format('DD-MM-YYYY HH:mm:ss') },
  { id: 'deleted_by_user_id', label: 'Deleted By', minWidth: 100 },
];

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const openPopover = Boolean(anchorEl);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRowClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(row);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleEdit = () => {
    setEditOpen(true);
    handleClosePopover();
  };

  const handleDelete = () => {
    setDeleteOpen(true);
    handleClosePopover();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchDonors = async () => {
    try {
      const getDonors = await getAllDonors();
      if (getDonors.length > 0) {
        setDonors(getDonors);
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  function NullValuePill({ label = "N/A", color = "default" }) {
    return (
      <Chip
      label={label}
      sx={{
        fontSize: '0.75rem',
        fontWeight: 500,
        background: 'linear-gradient(145deg, #ff4d4d, #cc0000)',
        color: '#fff',
        border: '1px solid #b30000',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 5px rgba(0,0,0,0.2)'
      }}
      />
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Loading Donors...
        </Typography>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={60} animation="wave" />
          </Box>
        ))}
      </Box>
    );
  }


  return (
    <Box>
    <Typography variant="h5" gutterBottom>Donors List</Typography>

    {loading ? (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Loading Donors...</Typography>
        {[...Array(5)].map((_, i) => (
          <Box key={i} sx={{ mb: 2 }}>
            <Skeleton variant="rectangular" height={50} />
          </Box>
        ))}
      </Box>
    ) : (
      <Paper sx={{ width: '100%', overflow: 'auto' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {donors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                <TableRow
                  hover
                  key={idx}
                  onClick={(e) => handleRowClick(e, row)}
                  sx={{ cursor: 'pointer' }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id}>
                        {column.format ? column.format(value) : value || <NullValuePill label="null" />}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={donors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{position: 'absolute'}}
        />
      </Paper>
    )}

      {/* FAB to Create Category */}
      <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 100, right: 50 }}
          onClick={() => {
          setCreateOpen(true);
          }}
      >
      <AddIcon />
    </Fab>

    {/* Popover with actions */}
    <Popover
      open={openPopover}
      anchorEl={anchorEl}
      onClose={handleClosePopover}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <List dense>
        <ListItem button onClick={handleEdit}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText primary="Update" />
        </ListItem>
        <ListItem button onClick={handleDelete}>
          <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
          <ListItemText primary="Delete" />
        </ListItem>
      </List>
    </Popover>

    {/* Edit Modal */}
    <EditCategoryDialog
      open={editOpen}
      category={selectedCategory}
      onClose={() => setEditOpen(false)}
      onUpdated={fetchDonors}
    />

    {/* Delete Confirmation Dialog */}
    <DeleteConfirmDialog
      open={deleteOpen}
      category={selectedCategory}
      onClose={() => setDeleteOpen(false)}
      onDeleted={fetchDonors}
    />

      {/* Create Modal */}
      <CreateCategoryDialog
      open={createOpen}
      onClose={() => setCreateOpen(false)}
      onUpdated={fetchDonors}
    />


    {/* Snackbar Notification */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Box>
  );
}
