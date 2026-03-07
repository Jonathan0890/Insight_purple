import { useState, useMemo } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Typography,
    Chip,
    Box,
    Paper,
    Alert,
    IconButton,
    InputAdornment,
    Grid,
    Card,
    CardContent,
    Avatar,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Container,
} from '@mui/material';

import {
    Add,
    Search,
    Edit,
    Delete,
    Inventory,
    Warning,
    AttachMoney,
    Category,
} from '@mui/icons-material';

import { ExportButtons } from '../components/ui/ExportButtons';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
//import { useProducts, Product } from '../hooks/useProducts';

export const ProductManagement = () => {
    const {
        products,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
    } = useProducts();

    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        sku: '',
        price: 0,
        stock: 0,
        category: '',
    });
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleOpen = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                sku: '',
                price: 0,
                stock: 0,
                category: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingProduct(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.name === 'price' || e.target.name === 'stock'
                ? Number(e.target.value)
                : e.target.value,
        });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.sku) return;

        if (editingProduct) {
            await updateProduct(editingProduct.id, formData);
        } else {
            await createProduct({
                name: formData.name!,
                sku: formData.sku!,
                price: Number(formData.price) || 0,
                stock: Number(formData.stock) || 0,
                category: formData.category || '',
            });
        }

        handleClose();
    };

    const handleDelete = async (product: Product) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            await deleteProduct(product.id);
        }
    };

    const handleExportCSV = () => {
        const columns = [
            { id: 'name', label: 'Nombre' },
            { id: 'sku', label: 'SKU' },
            { id: 'price', label: 'Precio' },
            { id: 'stock', label: 'Stock' },
            { id: 'category', label: 'Categoría' },
        ];
        exportToCSV(filteredProducts, columns, 'productos');
    };

    const handleExportPDF = () => {
        exportToPDF('Reporte de Productos');
    };

    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stock < 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* HEADER */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h3" fontWeight="bold">
                            Productos
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Gestiona tu inventario y catálogo
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <ExportButtons
                            onExportCSV={handleExportCSV}
                            onExportPDF={handleExportPDF}
                            disabled={filteredProducts.length === 0}
                        />

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpen()}
                            sx={{
                                borderRadius: 2,
                                bgcolor: 'white',
                                color: 'primary.main',
                            }}
                        >
                            NUEVO PRODUCTO
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* STATS */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">Total</Typography>
                            <Typography variant="h4">{totalProducts}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">Stock Bajo</Typography>
                            <Typography color="warning.main" variant="h4">
                                {lowStock}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">Agotados</Typography>
                            <Typography color="error.main" variant="h4">
                                {outOfStock}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">Valor Inventario</Typography>
                            <Typography color="success.main" variant="h4">
                                ${totalValue.toFixed(0)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* BUSCADOR */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Chip label={`${filteredProducts.length} resultados`} />
                </Stack>
            </Paper>

            {lowStock > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Hay {lowStock} productos con stock bajo.
                </Alert>
            )}

            {/* TABLA */}
            <Paper>
                {loading && <LinearProgress />}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Precio</TableCell>
                                <TableCell align="center">Stock</TableCell>
                                <TableCell>Categoría</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Typography fontWeight="bold">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.sku}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="right">
                                        ${product.price.toFixed(2)}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Chip
                                            label={product.stock}
                                            color={
                                                product.stock === 0
                                                    ? 'error'
                                                    : product.stock < 10
                                                        ? 'warning'
                                                        : 'success'
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>{product.category}</TableCell>

                                    <TableCell align="center">
                                        <IconButton
                                            onClick={() => handleOpen(product)}
                                            color="primary"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(product)}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* MODAL */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={3}>
                        <TextField
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="SKU"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Precio"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Stock"
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Categoría"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave}>
                        {editingProduct ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};