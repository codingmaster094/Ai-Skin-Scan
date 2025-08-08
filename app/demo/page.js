'use client'

import { useState } from 'react';

export default function Page() {
    const [isMonthly, setIsMonthly] = useState(true);

    return (
        <div className="context">
            <div className="toggle-wrapper">
                <button
                    className={`toggle-button ${isMonthly ? 'active' : ''}`}
                    onClick={() => setIsMonthly(true)}
                >
                    Monthly
                </button>
                <button
                    className={`toggle-button ${!isMonthly ? 'active' : ''}`}
                    onClick={() => setIsMonthly(false)}
                >
                    Yearly
                </button>
            </div>
        </div>
    );
}
