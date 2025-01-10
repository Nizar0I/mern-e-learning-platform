import React, { useState } from 'react';
import { signupUser } from '../services/api';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]   = useState('student'); // Par défaut "student"
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser({ username, email, password, role });
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      // Par exemple, rediriger vers le login
      window.location.href = '/login';
    } catch (err) {
      console.log(err.response?.status)
      if (err.response?.status === 500) {
        setError("Erreur lors de l'inscription, veuillez reéssayer plutard");
      }
      setError("Utilisateur Existant, Veuillez Choisir un Nouvel Email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Inscription</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Nom d'utilisateur</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Veuillez Indiquer Votre Nom Complet"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Veuillez Indiquer Votre Email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Mot de passe</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Veuillez Indiquer Votre Mot de Passe"
            required
          />
        </div>

        {/* Sélecteur de rôle */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Rôle</label>
          <select
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Utilisateur (Student)</option>
            <option value="instructor">Formateur (Instructor)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Signup;
