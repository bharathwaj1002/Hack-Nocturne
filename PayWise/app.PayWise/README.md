# PayWise

PayWise is a React-based frontend application integrated with a Django backend to provide secure UPI transactions. The application monitors transactions for suspicious UPI IDs and flags high-risk transactions to prevent fraud.

## Features

- Real-time transaction monitoring
- Automatic flagging of high-value transactions
- Secure authentication with multi-factor authentication
- Reporting of suspicious UPI IDs

## Technologies Used

- React
- Vite
- Django
- Django REST framework
- Axios
- Tailwind CSS
- Lucide React Icons

## Setup Instructions

### Prerequisites

- Node.js and npm
- Python and pip
- Django

### Frontend Setup

1. Clone the frontend repository:

   ```sh
   git clone https://github.com/bharathwaj1002/FinTech-a-thon.git
   cd FinTech-a-thon

2. Install the dependencies:
    ```sh
    npm install

3. Start the Vite development server:
    ```sh
    npm run dev

### Backend Setup
1. Clone the backend repository:
    ```sh
    git clone https://github.com/bharathwaj1002/api.Fintech_a_thon.git
    cd api.Fintech_a_thon
2. Create a virtual environment and activate it:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
3. Install the dependencies:
    ```sh
    pip install -r requirements.txt
4. Prepare and apply migrations:
    ```sh
    python manage.py makemigrations
    python manage.py migrate
5. Start the Django development server:
    ```sh
    python manage.py runserver

### API Endpoints

    POST /api/check-suspicious-upi/: Check if a UPI ID is suspicious.

### Usage
1. Open the React application in your browser at http://localhost:5173.
2. Enter the transaction details, including the amount and UPI ID.
3. Submit the transaction to check if the UPI ID is suspicious.
4. If the UPI ID is flagged as suspicious, you can choose to report it or proceed with caution.
