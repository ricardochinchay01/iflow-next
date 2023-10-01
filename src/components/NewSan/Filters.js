import React, { useState, useEffect } from 'react';

const Filters = ({ onFilter }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderId, setOrderId] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            setIsButtonDisabled(end < start);
        } else {
            setIsButtonDisabled(false);
        }
    }, [startDate, endDate, orderId]);

    const handleFilter = (e) => {
        e.preventDefault();
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end < start) return;
        }
        onFilter(startDate, endDate, orderId);
    }

    return (
        <div className="mb-4">
            <form onSubmit={handleFilter}>
                <label>
                    Fecha de inicio:
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label>
                    Fecha de fin:
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </label>
                <label>
                    Order ID:
                    <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
                </label>
                <button type="submit" disabled={isButtonDisabled}>Filtrar</button>
            </form>
        </div>
    );
}

export default Filters;
