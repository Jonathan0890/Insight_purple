// Convertir array de objetos a CSV
export const convertToCSV = <T extends Record<string, any>>(
    data: T[],
    columns: { id: keyof T | string; label: string }[]
): string => {
    if (!data.length) return '';

    // Encabezados
    const headers = columns.map(col => col.label).join(',');

    // Filas
    const rows = data.map(row => {
        return columns
            .map(col => {
                const value = row[col.id as keyof T];
                // Escapar comillas y manejar valores con comas
                if (value === null || value === undefined) return '';
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            })
            .join(',');
    });

    return [headers, ...rows].join('\n');
};

// Descargar archivo
export const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Exportar a CSV
export const exportToCSV = <T extends Record<string, any>>(
    data: T[],
    columns: { id: keyof T | string; label: string }[],
    filename: string
) => {
    const csv = convertToCSV(data, columns);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
};

// Exportar a PDF (simulado - en producción usarías una librería como jsPDF)
export const exportToPDF = (title: string) => {
    // Simulación - en realidad aquí iría la generación de PDF
    alert(`Generando reporte PDF: ${title} (simulado)`);
    // En producción podrías usar window.print() o una librería
};