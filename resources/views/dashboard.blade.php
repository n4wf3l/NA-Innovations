<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Dashboard - NA</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="//unpkg.com/alpinejs" defer></script>
    <!-- Styles -->
    <style>
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        html {
            scroll-behavior: smooth;
        }
        /* Ajoutez ici vos styles supplémentaires */

    </style>
    @vite('resources/css/app.css')
</head>

<body>
    <header>
    <div id="app">
        <div class="flex flex-col py-12 bg-gray-900">
            <div class="flex justify-between items-center self-center mt-1 w-full max-w-[1298px] px-4">
                <div class="text-3xl font-bold text-white">NA</div>
                <button id="hamburgerBtn" class="md:hidden block text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <div id="navLinks" class="hidden md:flex gap-5 justify-between pr-5 text-lg font-medium text-white whitespace-nowrap"><div>
                <a href="{{ url('/') }}"  class="hover:text-teal-300">Accueil</a>
            </div>

            <div>
                <a href="#about" class="hover:text-teal-300">Services</a>
            </div>
            <div>
                <a href="#projects" class="hover:text-teal-300">Projets</a>
            </div>
            <div>
            <a href="{{ route('about') }}" class="hover:text-teal-300">À propos</a>
            </div>
        <div>
        <a href="" class="hover:text-teal-300">Nouveautés</a>
        </div>
    <div>
    <a href="{{ route('contact') }}" class="hover:text-teal-300">Contact</a>
        </div> |
        <div>
        <a href="{{ url('/dashboard') }}"  class="text-teal-300 hover:text-teal-300">Dashboard</a>
        </div>
    </div>
    </header>

    <section class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-semibold mb-6">Dashboard</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Ajouter un site publié</h2>
                <form action="{{ route('projets.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
    <div>
        <label for="nom_societe">Nom de la société :</label>
        <input type="text" name="nom_societe" required>
    </div>
    <div>
        <label for="type_societe">Type de société :</label>
        <input type="text" name="type_societe" required>
    </div>
    <div>
        <label for="type_site">Type de site :</label>
        <input type="text" name="type_site" required>
    </div>
    <div>
        <label for="lieu">Lieu :</label>
        <input type="text" name="lieu" required>
    </div>
    <div>
        <label for="jours_developpement">Jours de développement :</label>
        <input type="number" name="jours_developpement" required>
    </div>
    <div>
        <label for="langage_programmation">Langage de programmation :</label>
        <input type="text" name="langage_programmation" required>
    </div>
    <div>
        <label for="etoiles">Étoiles (satisfaction) :</label>
        <select name="etoiles" required>
            <option value="★☆☆☆☆">★☆☆☆☆</option>
            <option value="★★☆☆☆">★★☆☆☆</option>
            <option value="★★★☆☆">★★★☆☆</option>
            <option value="★★★★☆">★★★★☆</option>
            <option value="★★★★★">★★★★★</option>
        </select>
    </div>
    <div>
        <label for="nombre_collaborateurs">Nombre de collaborateurs :</label>
        <input type="number" name="nombre_collaborateurs" required>
    </div>
    <div>
        <label for="lien">Lien :</label>
        <input type="text" name="lien" required>
    </div>
    <div>
        <label for="image">Photo :</label>
        <input type="file" name="image" required>
    </div>
    <div>
        <button type="submit">Ajouter le projet</button>
    </div>
</form>
</div>

< <div class="bg-white rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Ajouter un projet académique</h2>
                <form action="{{ route('academic_projets.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
    <div>
        <label for="nom_societe">Nom de la société :</label>
        <input type="text" name="nom_societe" required>
    </div>
    <div>
        <label for="type_societe">Type de société :</label>
        <input type="text" name="type_societe" required>
    </div>
    <div>
        <label for="type_site">Type de site :</label>
        <input type="text" name="type_site" required>
    </div>
    <div>
        <label for="lieu">Lieu :</label>
        <input type="text" name="lieu" required>
    </div>
    <div>
        <label for="jours_developpement">Jours de développement :</label>
        <input type="number" name="jours_developpement" required>
    </div>
    <div>
        <label for="langage_programmation">Langage de programmation :</label>
        <input type="text" name="langage_programmation" required>
    </div>
    <div>
        <label for="etoiles">Étoiles (satisfaction) :</label>
        <select name="etoiles" required>
            <option value="★☆☆☆☆">★☆☆☆☆</option>
            <option value="★★☆☆☆">★★☆☆☆</option>
            <option value="★★★☆☆">★★★☆☆</option>
            <option value="★★★★☆">★★★★☆</option>
            <option value="★★★★★">★★★★★</option>
        </select>
    </div>
    <div>
        <label for="nombre_collaborateurs">Nombre de collaborateurs :</label>
        <input type="number" name="nombre_collaborateurs" required>
    </div>
    <div>
        <label for="lien">Lien :</label>
        <input type="text" name="lien" required placeholder="https://exemple.com">
    </div>
    <div>
        <label for="image">Photo :</label>
        <input type="file" name="image" required>
    </div>
    <div>
        <button type="submit">Ajouter le projet</button>
    </div>
    </div>
</section>




<footer class="bg-gray-100 py-12">
    <div class="container mx-auto">
        <div class="border-t border-gray-300"></div>
        <div class="flex justify-between items-center mt-8">
            <div class="w-1/2 md:w-2/3 lg:w-1/3">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">À propos de NA</h2>
                <p class="text-sm text-gray-600">NA est un ingénieur software et développeur fullstack diplômé et formé à la Haute Ecole Erasmus de Bruxelles. </p>
                <div class="flex items-center mt-6">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/949187d7ee1e2afd8a023c671f59d74c39c29d054926767f17b217fed5475910?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a7d60a3960400d8a490b85c9fa9558bb8a2473d9b8b90dc4a3c6c99c2b361f7f?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/20b91319aa8c73e3d645eb4aeefedc7f337acd87cc2bcea1a90ca77d18e63440?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
              
                </div>
            </div>
            <div class="w-1/2 md:w-1/3 lg:w-1/4">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Contact</h2>
                <div class="text-sm text-gray-600">
                    <p class="mb-2">170 Nijverheidskaai, Anderlecht</p>
                    <p class="mb-2">info@nawfelajari.be</p>
                    <p>+977-9876543210</p>
                </div>
            </div>
        </div>
        <div class="border-t border-gray-300 mt-12"></div>
    </div>
</footer>


    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            const navLinks = document.getElementById('navLinks');

            hamburgerBtn.addEventListener('click', () => {
                navLinks.classList.toggle('hidden');
            });
        });
    </script>
</body>

</html>