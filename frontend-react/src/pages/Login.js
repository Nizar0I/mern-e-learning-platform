import React, { useState } from "react";
import { loginUser } from "../services/api";
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password, role });
      // data is: { token: "..." }

      // 1) Store the token in local storage
      localStorage.setItem("token", data.token);

      // 2) Decode the token to get the userId
      const decoded = jwtDecode(data.token);
      // Typically your token payload might look like:
      // { userId: 'some-user-id', iat: 166722..., exp: 166723... }
      // So we'll do:
      const userId = decoded.userId; // Adjust the key if your payload is different

      // 3) Store userId in localStorage
      localStorage.setItem("userId", userId);

      alert("Connexion réussie !");

      // 4) Redirect based on role
      if (role === "instructor") {
        window.location.href = "/instructor/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Identifiant / Mot de passe Incorrect");
      } else {
        setError(err.response?.data?.error || "Erreur lors de la connexion");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Connexion</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

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

        {/* Sélecteur de rôle
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
        */}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;