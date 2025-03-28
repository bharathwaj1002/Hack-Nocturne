import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Send,
  History,
  User,
  Lock,
  Flag,
  AlertCircle,
  X,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

interface Transaction {
  id: string;
  amount: number;
  to: string;
  timestamp: Date;
  status: "success" | "flagged" | "blocked";
}

function App() {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"amount" | "suspicious" | null>(
    null
  );
  const [showReportModal, setShowReportModal] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Transaction Data
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: 1000,
      to: "merchant@bank",
      timestamp: new Date(),
      status: "success",
    },
    {
      id: "2",
      amount: 50000,
      to: "unknown@suspicious",
      timestamp: new Date(Date.now() - 3600000),
      status: "blocked",
    },
    {
      id: "3",
      amount: 25000,
      to: "newuser@bank",
      timestamp: new Date(Date.now() - 7200000),
      status: "flagged",
    },
  ]);

  // Fetch CSRF Token
  useEffect(() => {
    const csrfToken =
      document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("csrftoken="))
        ?.split("=")[1] || "";
    setCsrfToken(csrfToken);
  }, []);

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/check-suspicious-upi",
        { upiId },
        {
          headers: {
            "X-CSRFToken": csrfToken, // Attach CSRF token
          },
          withCredentials: true, // Ensure cookies are included with the request
        }
      );
      if (response.data.isSuspicious) {
        if (amountNum > 10000) {
          setAlertType("amount");
          setShowAlert(true);
        } else {
          setAlertType("suspicious");
          setShowAlert(true);
        }
      } else {
        proceedWithTransaction();
      }
    } catch (error) {
      console.error("Error verifying UPI ID:", error);
      setAlertType("suspicious");
      setShowAlert(true);
    }
  };

  const proceedWithTransaction = () => {
    // In a real app, this would process the transaction
    alert("Transaction successful!");
    setAmount("");
    setUpiId("");
    setShowAlert(false);
  };

  const handleReport = () => {
    setShowReportModal(false);
    // In a real app, this would update the database
    alert("Thank you for reporting this UPI ID. Our team will investigate.");
  };

  const renderAlertContent = () => {
    if (alertType === "suspicious") {
      return (
        <div className="space-y-1">
          <p className="font-semibold text-red-700">
            ⚠️ High-Risk UPI ID Detected!
          </p>
          <p>This UPI ID has been reported multiple times!</p>
          <p className="text-sm text-red-600">
            Please verify the recipient carefully before proceeding.
          </p>
        </div>
      );
    }
    return <p>Suspicious transaction detected! Amount exceeds safe limit.</p>;
  };

  const canProceed = () => {
    return alertType === "suspicious";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-800">
                SecureUPI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <User className="h-6 w-6 text-gray-600" />
              <span className="text-gray-600">Demo User</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showAlert && (
          <div
            className={`mb-4 p-4 ${
              alertType === "suspicious"
                ? "bg-red-100 border-red-500"
                : "bg-yellow-100 border-yellow-500"
            } border-l-4 text-gray-700 flex items-center justify-between animate-bounce`}
          >
            <div className="flex items-center flex-grow">
              <AlertTriangle className="h-6 w-6 mr-3 text-red-500 flex-shrink-0" />
              <div className="flex-grow">{renderAlertContent()}</div>
            </div>
            <div className="flex items-center ml-4 space-x-3 flex-shrink-0">
              {alertType === "suspicious" && (
                <>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report UPI ID
                  </button>
                  {canProceed() && (
                    <button
                      onClick={proceedWithTransaction}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Proceed Anyway
                    </button>
                  )}
                </>
              )}
              <button
                onClick={() => setShowAlert(false)}
                className="p-1 hover:bg-red-200 rounded-full"
                aria-label="Close alert"
              >
                <X className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        )}

        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
                <AlertCircle className="h-6 w-6 mr-2" />
                Report Suspicious UPI ID
              </h3>
              <p className="mb-4 text-gray-600">
                Are you sure you want to report {upiId} as suspicious? This will
                help protect other users from potential fraud.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Report UPI ID
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Send className="h-6 w-6 mr-2 text-indigo-600" />
              New Transaction
            </h2>
            <form onSubmit={handleTransaction}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="example@bank"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Pay Now
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <History className="h-6 w-6 mr-2 text-indigo-600" />
              Recent Transactions
            </h2>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        ₹{tx.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">{tx.to}</p>
                      <p className="text-xs text-gray-500">
                        {tx.timestamp.toLocaleString()}
                      </p>
                    </div>
                    {tx.status === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {tx.status === "flagged" && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    {tx.status === "blocked" && (
                      <Lock className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Fraud Prevention Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className="font-semibold mb-2">Transaction Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Real-time monitoring of all transactions for suspicious patterns
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <AlertTriangle className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className="font-semibold mb-2">Amount Limits</h3>
              <p className="text-gray-600 text-sm">
                Automatic flagging of high-value transactions
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Lock className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className="font-semibold mb-2">Secure Authentication</h3>
              <p className="text-gray-600 text-sm">
                Multi-factor authentication for all transactions
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
