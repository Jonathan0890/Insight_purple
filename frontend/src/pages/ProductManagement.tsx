import { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Typography,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
}

// Datos iniciales mock
const initialProducts: Product[] = [
    { id: '1', name: 'Mouse Ergónico', sku: 'MSE-001', price: 45.99, stock: 8, category: 'Periféricos' },
    { id: '2', name: 'Cable HDMI 2.1', sku: 'HDMI-210', price: 19.99, stock: 5, category: 'Accesorios' },
    { id: '3', name: 'Teclado Mecánico', sku: 'TEC-001', price: 89.99, stock: 15, category: 'Periféricos' },
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

    // Cargar productos desde localStorage al montar
    useEffect(() => {
        const stored = localStorage.getItem('products');
        if (stored) {
            setProducts(JSON.parse(stored));
        } else {
            setProducts(initialProducts);
            localStorage.setItem('products', JSON.stringify(initialProducts));
        }
    }, []);

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
            // Editar
            updatedProducts = products.map(p =>
                p.id === editingProduct.id ? { ...p, ...formData, id: p.id } as Product : p
            );
        } else {
            // Crear nuevo
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

    const handleDelete = (id: string) => {
        if (window.confirm('¿Eliminar producto?')) {
            const updated = products.filter(p => p.id !== id);
            setProducts(updated);
            localStorage.setItem('products', JSON.stringify(updated));
        }
    };

    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Gestión de Productos</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Nuevo Producto
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell align="right">Precio</TableCell>
                            <TableCell align="right">Stock</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                                <TableCell align="right">{product.stock}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => handleOpen(product)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(product.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal de creación/edición */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="SKU"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            fullWidth
                            required
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
                    <Button onClick={handleSave} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};