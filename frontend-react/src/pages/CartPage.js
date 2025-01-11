// src/pages/CartPage.js
import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  // Calculate total price (if you want)
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mon Panier</h1>

      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div>
          {cart.map((course) => (
            <div
              key={course._id}
              className="border rounded p-4 mb-2 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{course.title}</p>
                <p>{course.price === 0 ? "Gratuit" : `${course.price} €`}</p>
              </div>
              <button
                onClick={() => removeFromCart(course._id)}
                className="text-red-600"
              >
                Retirer
              </button>
            </div>
          ))}

          <div className="mt-4 flex justify-between items-center">
            <p className="text-xl font-bold">
              Total: {totalPrice === 0 ? "Gratuit" : `${totalPrice} €`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="px-4 py-2 text-red-600 border border-red-600 rounded"
              >
                Vider le panier
              </button>
              <Link
                to="/checkout"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Passer au paiement
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
