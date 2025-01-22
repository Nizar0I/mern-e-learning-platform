import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { checkout } from "../services/api"; // <-- import your API service function

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

    if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.push("Numéro de carte invalide (16 chiffres requis)");
    }
    if (!/^\d{2}\/\d{2,4}$/.test(expiryDate)) {
      newErrors.push("Date d’expiration invalide (format MM/YY attendu)");
    }
    if (!/^\d{3}$/.test(cvc)) {
      newErrors.push("CVC invalide (3 chiffres requis)");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    setIsProcessing(true);

    try {
      // 1) Simulate a real payment process (like Stripe) here
      // For demo, we just do a 2-second timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 2) After "payment" success, call our backend to record the purchase
      // Retrieve userId from localStorage (assuming you stored it at login)
      const userId = localStorage.getItem("userId");
      
      // If you have no userId stored yet, you'll need to handle that scenario
      // e.g., if (!userId) throw new Error("User not logged in");

      const payload = {
        userId,
        cart,       // the array of courses from the CartContext
        currency: "EUR",
      };

      const response = await checkout(payload);
      // If successful, the server returns something like { message: "Paiement réussi" }
      console.log("Checkout success:", response.data);

      setIsProcessing(false);
      setSuccess(true);

    } catch (error) {
      setIsProcessing(false);
      // If axios fails with a server error:
      if (error.response) {
        setErrors([error.response.data.error || "Erreur lors du paiement"]);
      } else {
        setErrors([error.message]);
      }
    }
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
                  Vous pouvez maintenant accéder au contenu du cours. Merci pour votre achat !
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