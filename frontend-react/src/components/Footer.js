import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Section 1: À propos */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">À propos</h2>
            <p className="text-sm">
              StudyFi est une plateforme E-learning offrant des cours en ligne interactifs pour améliorer vos compétences et réussir vos objectifs éducatifs.
            </p>
          </div>

          {/* Section 2: Liens utiles */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">Liens utiles</h2>
            <ul>
              <li><a href="/about" className="hover:text-white">À propos</a></li>
              <li><a href="/courses" className="hover:text-white">Cours</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Section 3: Assistance */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">Assistance</h2>
            <ul>
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/support" className="hover:text-white">Support</a></li>
              <li><a href="/terms" className="hover:text-white">Conditions d'utilisation</a></li>
              <li><a href="/privacy" className="hover:text-white">Politique de confidentialité</a></li>
            </ul>
          </div>

          {/* Section 4: Suivez-nous */}
          <div className="w-full md:w-1/4">
            <h2 className="text-xl font-semibold mb-4">Suivez-nous</h2>
            <div className="flex space-x-4">
              <a href="https://facebook.com" aria-label="Facebook" className="hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p>© {new Date().getFullYear()} StudyFi. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
