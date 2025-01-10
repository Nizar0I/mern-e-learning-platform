import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState("");

  // Hook React Router pour naviguer programatiquement
  const navigate = useNavigate();

  // Fonction de recherche (redirection vers /courses?search=...)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <main>
      {/* Section Hero */}
      <section
        className="h-[70vh] bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1581093588401-9f09b32383fa?auto=format&w=1350&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="relative z-10 text-center text-white p-4 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Étudiez, progressez, réussissez
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Rejoignez <span className="font-semibold">StudyFi</span>, la
            plateforme e-learning conçue pour booster vos compétences et
            atteindre vos objectifs.
          </p>

          {/* Barre de recherche */}
          <form
            onSubmit={handleSearch}
            className="flex justify-center items-center gap-2 px-2"
          >
            <input
              type="text"
              className="w-full max-w-sm px-4 py-2 rounded-l-md text-gray-800"
              placeholder="Recherchez un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-r-md text-white font-semibold transition"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      {/* Section Avantages / Promotion de la plateforme */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Pourquoi choisir StudyFi ?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white shadow rounded p-6 text-center">
            <img
              src="https://img.icons8.com/color/96/books.png"
              alt="Cours de qualité"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Des cours de qualité</h3>
            <p className="text-gray-600">
              Découvrez des formations créées par des experts, régulièrement
              mises à jour et adaptées à tous les niveaux.
            </p>
          </div>

          <div className="bg-white shadow rounded p-6 text-center">
            <img
              src="https://img.icons8.com/color/96/classroom.png"
              alt="Communauté active"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Communauté active</h3>
            <p className="text-gray-600">
              Participez à des forums, posez vos questions et échangez avec
              d'autres apprenants ou formateurs passionnés.
            </p>
          </div>

          <div className="bg-white shadow rounded p-6 text-center">
            <img
              src="https://img.icons8.com/color/96/contract-job.png"
              alt="Flexibilité"
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">
              Flexibilité & réussite
            </h3>
            <p className="text-gray-600">
              Apprenez à votre rythme, suivez votre progression et recevez des
              certifications valorisantes.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/courses"
            className="bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
          >
            Voir tous les cours
          </Link>
        </div>
      </section>

      {/* Section supplémentaire avec images */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
            Découvrez, apprenez, progressez
          </h2>
          <p className="max-w-2xl mx-auto text-center text-gray-700 mb-8">
            Chez <span className="font-semibold">StudyFi</span>, nous croyons
            que l'apprentissage doit être accessible à tous. Avec nos multiples
            ressources et nos outils performants, vous avez toutes les clés en
            main pour réussir.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544717305-996b815c338c?auto=format&w=800&q=80"
                alt="Étudier à son rythme"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold mb-2">
                  Étudiez à votre rythme
                </h4>
                <p className="text-gray-600">
                  Accédez à vos cours n'importe où, n'importe quand, grâce à
                  notre plateforme adaptée à tous les appareils.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&w=800&q=80"
                alt="Suivi personnalisé"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold mb-2">
                  Suivi personnalisé
                </h4>
                <p className="text-gray-600">
                  Bénéficiez de tableaux de bord clairs, suivez votre
                  progression et restez motivé.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518972559570-0a555944f0e0?auto=format&w=800&q=80"
                alt="Communauté d'entraide"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold mb-2">
                  Communauté d'entraide
                </h4>
                <p className="text-gray-600">
                  Rejoignez un réseau d'apprenants et de formateurs, partagez
                  vos questions et vos connaissances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
