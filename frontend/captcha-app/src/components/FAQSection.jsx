import React from 'react';

const FAQSection = () => {
    return (
        <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq">
                <details>
                    <summary>What is e-Aadhaar?</summary>
                    <p>Explanation about e-Aadhaar...</p>
                </details>
                <details>
                    <summary>Is e-Aadhaar equally valid like physical copy of Aadhaar?</summary>
                    <p>Yes, e-Aadhaar is...</p>
                </details>
                {/* Add more FAQs as necessary */}
            </div>
        </div>
    );
};

export default FAQSection;