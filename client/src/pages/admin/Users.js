import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  InputAdornment,
  Button,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from '../../components/layout/Layout';
import { getUsers } from '../../services/adminService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply search filter whenever searchTerm changes
  useEffect(() => {
    applySearchFilter();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getUsers();

      if (result.status) {
        setUsers(result.users);
        setFilteredUsers(result.users);
      } else {
        setError('Failed to load users');
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const applySearchFilter = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtered = users.filter(
      user =>
        (user.name && user.name.toLowerCase().includes(search)) ||
        (user.email && user.email.toLowerCase().includes(search)) ||
        (user._id && user._id.toLowerCase().includes(search)) ||
        (user.role && user.role.toLowerCase().includes(search))
    );

    setFilteredUsers(filtered);
    setPage(0); // Reset to first page when search changes
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            User Management
          </Typography>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
          >
            Refresh
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Users"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name, email, ID, or role"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Total Users: {users.length} | Filtered: {filteredUsers.length}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {filteredUsers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {users.length === 0 ? 'No users found.' : 'No users match your search criteria.'}
            </Typography>
            {users.length > 0 && filteredUsers.length === 0 && (
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            )}
          </Paper>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="users table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow hover key={user._id}>
                        <TableCell>
                          <Typography
                            sx={{
                              maxWidth: 150,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {user._id}
                          </Typography>
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={user.role === 'admin' ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </Container>
    </Layout>
  );
};

export default AdminUsers;
