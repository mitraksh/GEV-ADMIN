import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  InputLabel
} from '@mui/material';
import axios from 'axios';

export default function EditCategoryDialog({ open, category, onClose, onUpdated }) {
  const [image, setImage] = useState(null);
  const [imageSm, setImageSm] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSmPreview, setImageSmPreview] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', parent_id: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || '',
        description: category.description || '',
        parentId: category.parent_id || ''
      });
    }
  }, [category]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (type === 'image') {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (type === 'imageSm') {
      setImageSm(file);
      setImageSmPreview(URL.createObjectURL(file));
    }
  };
  

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.put(`http://localhost:8080/cause-categories/${category.id}`, {
        ...category,
        ...form
      });
      onUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Category</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="name"
            label="Name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
          <TextField
            name="parentId"
            label="Parent ID"
            fullWidth
            value={form.parentId}
            onChange={handleChange}
          />
        <Box>
          <InputLabel shrink>Upload Image (Full Size)</InputLabel>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
          {imagePreview && (
            <Box mt={1}>
              <img src={imagePreview} alt="Preview" height="100" style={{ borderRadius: 8 }} />
            </Box>
          )}
        </Box>

        <Box>
          <InputLabel shrink>Upload Image (Small Device)</InputLabel>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imageSm')} />
          {imageSmPreview && (
            <Box mt={1}>
              <img src={imageSmPreview} alt="Small Preview" height="100" style={{ borderRadius: 8 }} />
            </Box>
          )}
        </Box>
      </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} variant="contained">
          {submitting ? 'Saving...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}