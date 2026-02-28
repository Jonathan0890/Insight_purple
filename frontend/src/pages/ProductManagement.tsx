import { useState, useEffect, useMemo } from 'react';
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

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
}

const initialProducts: Product[] = [
    { id: '1', name: 'Mouse Ergónico', sku: 'MSE-001', price: 45.99, stock: 8, category: 'Periféricos' },
    { id: '2', name: 'Cable HDMI 2.1', sku: 'HDMI-210', price: 19.99, stock: 5, category: 'Accesorios' },
    { id: '3', name: 'Teclado Mecánico', sku: 'TEC-001', price: 89.99, stock: 15, category: 'Periféricos' },
    { id: '4', name: 'Monitor 24"', sku: 'MON-024', price: 199.99, stock: 3, category: 'Monitores' },
    { id: '5', name: 'Webcam HD', sku: 'CAM-001', price: 59.99, stock: 12, category: 'Accesorios' },
];

export const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const stored = localStorage.getItem('products');
            if (stored) {
                setProducts(JSON.parse(stored));
            } else {
                setProducts(initialProducts);
                localStorage.setItem('products', JSON.stringify(initialProducts));
            }
            setLoading(false);
        }, 500);
    }, []);

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
            setFormData({ name: '', sku: '', price: 0, stock: 0, category: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingProduct(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!formData.name || !formData.sku) return;

        let updatedProducts: Product[];
        if (editingProduct) {
            updatedProducts = products.map(p =>
                p.id === editingProduct.id ? { ...p, ...formData, id: p.id } as Product : p
            );
        } else {
            const newProduct: Product = {
                id: Date.now().toString(),
                name: formData.name!,
                sku: formData.sku!,
                price: Number(formData.price) || 0,
                stock: Number(formData.stock) || 0,
                category: formData.category || '',
            };
            updatedProducts = [...products, newProduct];
        }
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        handleClose();
    };

    const handleDelete = (product: Product) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            const updated = products.filter(p => p.id !== product.id);
            setProducts(updated);
            localStorage.setItem('products', JSON.stringify(updated));
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
            {/* Header con título principal */}
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
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Productos
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Gestiona tu inventario y catálogo de productos
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
                                py: 1.5,
                                px: 3,
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                },
                            }}
                        >
                            NUEVO PRODUCTO
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* Tarjetas de estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom variant="body2">
                                        Total Productos
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold">
                                        {totalProducts}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                                    <Inventory sx={{ fontSize: 28 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom variant="body2">
                                        Stock Bajo
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="warning.main">
                                        {lowStock}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
                                    <Warning sx={{ fontSize: 28 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom variant="body2">
                                        Agotados
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="error.main">
                                        {outOfStock}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'error.light', width: 56, height: 56 }}>
                                    <Delete sx={{ fontSize: 28 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom variant="body2">
                                        Valor Inventario
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="success.main">
                                        ${totalValue.toFixed(0)}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                                    <AttachMoney sx={{ fontSize: 28 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Barra de búsqueda */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        placeholder="Buscar productos por nombre, SKU o categoría..."
                        variant="outlined"
                        size="medium"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                            sx: { fontSize: '1rem', py: 1.5 }
                        }}
                    />
                    <Chip
                        label={`${filteredProducts.length} resultados`}
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '1rem', px: 2, py: 2 }}
                    />
                </Stack>
            </Paper>

            {/* Alerta de stock crítico */}
            {lowStock > 0 && (
                <Alert
                    severity="warning"
                    sx={{ mb: 3, borderRadius: 2, py: 2 }}
                    action={
                        <Button color="inherit" size="medium" sx={{ fontSize: '0.9rem' }}>
                            Ver productos
                        </Button>
                    }
                >
                    <Typography variant="body1">
                        Hay <strong>{lowStock} producto(s) con stock bajo</strong>. Revisa la tabla para más detalles.
                    </Typography>
                </Alert>
            )}

            {/* Tabla de productos personalizada */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {loading && <LinearProgress />}
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }}>Producto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="right">Precio</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Stock</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }}>Categoría</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No hay productos para mostrar
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow
                                        key={product.id}
                                        sx={{
                                            '&:hover': { bgcolor: '#fafafa' },
                                            '&:last-child td': { borderBottom: 0 }
                                        }}
                                    >
                                        <TableCell sx={{ py: 3, px: 4 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        bgcolor: product.stock < 10 ? 'warning.light' : 'primary.light',
                                                    }}
                                                >
                                                    {product.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {product.sku}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" sx={{ py: 3, px: 4 }}>
                                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                ${product.price.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                            <Chip
                                                label={product.stock}
                                                color={product.stock === 0 ? 'error' : product.stock < 10 ? 'warning' : 'success'}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    minWidth: 80,
                                                    fontSize: '1rem',
                                                    py: 2,
                                                    '& .MuiChip-label': { px: 2 }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 3, px: 4 }}>
                                            <Chip
                                                label={product.category}
                                                variant="outlined"
                                                icon={<Category />}
                                                sx={{ fontSize: '0.95rem', py: 1.5 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpen(product)}
                                                sx={{ mr: 1, p: 1.5 }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(product)}
                                                sx={{ p: 1.5 }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Modal de creación/edición */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 2 } }}
            >
                <DialogTitle sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h5">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</Typography>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <TextField
                            label="Nombre del producto"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            size="medium"
                        />
                        <TextField
                            label="SKU"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            size="medium"
                        />
                        <TextField
                            label="Precio"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            size="medium"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Stock"
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            size="medium"
                        />
                        <TextField
                            label="Categoría"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            size="medium"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} variant="outlined" size="large" sx={{ px: 4 }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        size="large"
                        sx={{ px: 4, py: 1.5 }}
                    >
                        {editingProduct ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};