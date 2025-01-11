// src/pages/CheckoutPage.js
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // If cart is empty, show a message
  if (cart.length === 0) {
    return (
      <div className="p-4">
        <p>
          Votre panier est vide.{" "}
          <a href="/courses" className="text-blue-600">
            Revenir aux cours
          </a>
        </p>
      </div>
    );
  }

  // Calculate total price
  const totalPrice = cart.reduce((acc, c) => acc + c.price, 0);

  const handleOpenModal = () => {
    // Reset states each time we open the modal
    setCardNumber("");
    setExpiryDate("");
    setCvc("");
    setErrors([]);
    setSuccess(false);
    setIsProcessing(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsProcessing(false);
    setSuccess(false);
  };

  const handleConfirmPayment = async () => {
    // Basic validation
    const newErrors = [];

    // e.g., check card number length (16 digits for this example)
    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.push("Numéro de carte invalide (16 chiffres requis)");
    }

    // Check expiry date (MM/YY or MM/YYYY). This is very basic.
    if (!/^\d{2}\/\d{2,4}$/.test(expiryDate)) {
      newErrors.push("Date d’expiration invalide (format MM/YY attendu)");
    }

    // Check CVC (3 digits commonly)
    if (!/^\d{3}$/.test(cvc)) {
      newErrors.push("CVC invalide (3 chiffres requis)");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // If all validations pass, show spinner
    setErrors([]);
    setIsProcessing(true);

    // Simulate payment process (2 seconds)
    setTimeout(() => {
        setIsProcessing(false);
        setSuccess(true);
        // Delay clearing the cart for another few seconds
      }, 2000);
      
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* List courses in cart */}
      {cart.map((course) => (
        <div key={course._id} className="border-b py-2">
          <p className="font-semibold">{course.title}</p>
          <p>Prix: {course.price === 0 ? "Gratuit" : `${course.price} €`}</p>
        </div>
      ))}

      <p className="text-xl font-bold mt-4">
        Total: {totalPrice === 0 ? "Gratuit" : `${totalPrice} €`}
      </p>

      <button
        onClick={handleOpenModal}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Payer
      </button>

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={handleCloseModal}
            >
              X
            </button>

            {/* If not successful yet, show card fields & spinner */}
            {!success && (
              <>
                <h2 className="text-xl font-bold mb-4">Informations de paiement</h2>

                {/* Error messages */}
                {errors.length > 0 && (
                  <div className="mb-4 text-red-600">
                    {errors.map((err, i) => (
                      <p key={i}>• {err}</p>
                    ))}
                  </div>
                )}

                <label className="block mb-2">
                  Numéro de carte (16 chiffres)
                  <input
                    type="text"
                    maxLength={16}
                    className="border rounded w-full px-2 py-1 mt-1"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </label>

                <label className="block mb-2">
                  Date d’expiration (MM/YY)
                  <input
                    type="text"
                    className="border rounded w-full px-2 py-1 mt-1"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </label>

                <label className="block mb-2">
                  CVC (3 chiffres)
                  <input
                    type="text"
                    maxLength={3}
                    className="border rounded w-full px-2 py-1 mt-1"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                  />
                </label>

                {/* Payment button with spinner */}
                {isProcessing ? (
                  <div className="flex items-center justify-center mt-4">
                    {/* Simple spinner */}
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8 mr-2" />
                    <span>Traitement en cours...</span>
                  </div>
                ) : (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                    onClick={handleConfirmPayment}
                  >
                    Confirmer le paiement
                  </button>
                )}
              </>
            )}

            {/* Success message */}
            {success && (
              <div className="text-center">
                <div className="flex items-center justify-center my-4">
                  {/* Example of a success icon or checkmark */}
                  <svg
                    className="text-green-600 w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-600">
                  Commande confirmée !
                </h3>
                <p className="mb-4">
                  Vous allez recevoir les liens des cours par e-mail. Merci pour votre achat !
                </p>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    handleCloseModal();
                    clearCart();
                    navigate("/");
                  }}
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
