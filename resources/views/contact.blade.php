<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>

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
    </style>
    @vite('resources/css/app.css')
</head>

<body>
    <div id="app">
        <!-- Header avec le logo et le menu hamburger (qui remplace les nav links sur les petits écrans) -->
        <div class="flex flex-col py-12 bg-gray-900">
            <div class="flex justify-between items-center self-center mt-1 w-full max-w-[1298px] px-4">
                <div class="text-3xl font-bold text-white">NA</div>
                <!-- Bouton du menu hamburger (visible uniquement sur les petits écrans) -->
                <button id="hamburgerBtn" class="md:hidden block text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <!-- Navigation (cachez ceci sur les petits écrans et montrez-le sur les plus grands) -->
                <div id="navLinks"
                    class="hidden md:flex gap-5 justify-between pr-5 text-lg font-medium text-white whitespace-nowrap">
                    <div>
    <a href="/" class="hover:text-teal-300">Accueil</a>
</div>
<div>
    <a href="{{ route('about') }}" class="hover:text-teal-300">A propos</a>
</div>
<div>
    <a href="" class="hover:text-teal-300">Projets</a>
</div>
<div>
    <a href="" class="hover:text-teal-300">Nouveautés</a>
</div>
<div>
    <a href="{{ route('contact') }}" class="text-teal-300 hover:text-teal-300">Contact</a>
</div>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-center px-16 py-12 bg-white max-md:px-5">
            <div class="justify-center mt-28 w-full max-w-[1267px] max-md:mt-10 max-md:max-w-full">
                <div class="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
                    <div class="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                        <div
                            class="flex flex-col items-start self-stretch my-auto text-base text-black max-md:mt-10 max-md:max-w-full">
                            <div class="self-stretch text-6xl font-bold max-md:max-w-full max-md:text-4xl">
                                Let’s Talk
                            </div>
                            <div class="self-stretch mt-5 text-xl max-md:max-w-full">
                                Have some big idea or brand to develop and need help? Then reach out
                                we'd love to hear about your project and provide help
                            </div>
                            <div class="mt-14 text-3xl font-bold max-md:mt-10">Email</div>
                            <div class="mt-5">beebs@gmail.com</div>
                            <div class="mt-14 text-3xl font-bold max-md:mt-10">Socials</div>
                            <div class="mt-5 underline">Instagram</div>
                            <div class="mt-5 underline">Twitter</div>
                            <div class="mt-5 underline">Facebook</div>
                        </div>
                    </div>
                    <div class="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                        <div class="flex flex-col grow text-sm text-black max-md:mt-10 max-md:max-w-full">
                            <div class="max-md:max-w-full">Name</div>
                            <div class="shrink-0 mt-4 bg-neutral-100 h-[46px] max-md:max-w-full"></div>
                            <div class="mt-7 max-md:max-w-full">Email</div>
                            <div class="shrink-0 mt-4 bg-neutral-100 h-[46px] max-md:max-w-full"></div>
                            <div class="mt-7 max-md:max-w-full">
                                What service are you interested in
                            </div>
                            <div
                                class="flex gap-5 justify-between py-3 pr-11 pl-4 mt-4 font-light bg-neutral-100 text-zinc-400 max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
                                <div class="flex-auto self-start">Select project type</div>
                                <img loading="lazy"
                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/474f44d55593707435320c0b8b11a7f6a2db3681654094f2e9d4b8d3175e6b75?apiKey=d3784f4c52b7403885832573b3287702&"
                                    class="w-6 aspect-square" />
                            </div>
                            <div class="mt-7 max-md:max-w-full">Budget</div>
                            <div
                                class="flex gap-5 justify-between py-3 pr-10 pl-4 mt-4 font-light bg-neutral-100 text-zinc-400 max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
                                <div class="flex-auto self-start">Select project budget</div>
                                <img loading="lazy"
                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/474f44d55593707435320c0b8b11a7f6a2db3681654094f2e9d4b8d3175e6b75?apiKey=d3784f4c52b7403885832573b3287702&"
                                    class="w-6 aspect-square" />
                            </div>
                            <div class="mt-7 max-md:max-w-full">Message</div>
                            <div class="shrink-0 mt-4 bg-neutral-100 h-[165px] max-md:max-w-full"></div>
                            <div
                                class="justify-center items-center px-16 py-3.5 mt-7 text-xl font-medium text-white whitespace-nowrap bg-black max-md:px-5 max-md:max-w-full">
                                Submit
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="mt-8 w-full bg-gray-200 min-h-[1px] max-md:max-w-full"></div>
        <div
            class="flex gap-5 justify-between self-center mt-16 w-full max-w-[1296px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
            <div class="flex flex-col px-5">
                <div class="text-2xl font-medium text-neutral-400">
                    NA is an award UI/UX designer
                    <br />
                    and Product designer based in
                    <br />
                    Brussels, Belgium.
                </div>
                <div class="flex gap-2.5 justify-between mt-8">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/949187d7ee1e2afd8a023c671f59d74c39c29d054926767f17b217fed5475910?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a7d60a3960400d8a490b85c9fa9558bb8a2473d9b8b90dc4a3c6c99c2b361f7f?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/20b91319aa8c73e3d645eb4aeefedc7f337acd87cc2bcea1a90ca77d18e63440?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/838b7c845f263d78ac50df4c09cfc843e08ba74eb6e3e603983064d37fbee81c?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b2f9975f0a242de8fc7b1cc38447d6fce622ea7f35746a56b62556deeadabac?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8abdd2a2e215a6ae5858c9b7aafe359917e9bc82d828f4da9d246fb1d91edebc?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                </div>
            </div>
            <div class="flex flex-col self-start px-5 text-2xl font-medium whitespace-nowrap text-neutral-400">
                <div>address</div>
                <div class="mt-8">contact@nawfelajari.be</div>
                <div class="mt-7">+977-9876543210</div>
            </div>
        </div>
        <div class="mt-12 w-full bg-gray-200 min-h-[1px] max-md:mt-10 max-md:max-w-full"></div>
    </div>
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