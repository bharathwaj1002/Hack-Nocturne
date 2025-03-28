import React, { useState } from 'react';

function TickBox() {
    const [condition, setCondition] = useState(false);

    const toggleCondition = () => {
        setCondition(!condition);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                height: '100vh',
                paddingTop: '80px',
                background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', // Light gradient background
            }}
        >
            {/* Container to shift the box to the left */}
            <div
                style={{
                    transform: 'translateX(-50px)', // Shift the box 50px to the left
                }}
            >
                {/* Stylish and slightly smaller box with enhanced effects */}
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        background: condition
                            ? 'linear-gradient(135deg, #6a11cb, #2575fc)' // Gradient when active
                            : 'linear-gradient(135deg, #ffffff, #f1f1f1)', // Subtle gradient when inactive
                        border: '2px solid #6a11cb', // Purple border color
                        color: condition ? '#fff' : '#6a11cb', // White tick color when active
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        cursor: 'pointer',
                        borderRadius: '10px', // Rounded corners
                        boxShadow: condition
                            ? '0 8px 15px rgba(106, 17, 203, 0.3)' // Stronger shadow when active
                            : '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow when inactive
                        transition: 'all 0.4s ease', // Smooth transition for effects
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                    onClick={toggleCondition}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)'; // Slight scale on hover
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    {condition ? '✅' : ''}
                    {/* Glowing effect when condition is true */}
                    {condition && (
                        <div
                            style={{
                                content: '""',
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                background:
                                    'radial-gradient(circle, rgba(255,255,255,0.4), rgba(255,255,255,0))',
                                opacity: '0.8',
                                borderRadius: '10px',
                                animation: 'glow 1.5s infinite',
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default TickBox;