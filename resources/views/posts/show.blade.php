<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ $post->title }}</title>
    <link rel="icon" href="{{ asset('logonai.png') }}" type="image/x-icon" />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="//unpkg.com/alpinejs" defer></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('/show.css') }}">
    @vite('resources/css/app.css')
</head>

<body>
<div id="app">
        <!-- Header avec le logo et le menu hamburger (qui remplace les nav links sur les petits écrans) -->
        <div class="flex flex-col py-12 bg-gray-900">
            <div class="flex justify-between items-center self-center mt-1 w-full max-w-[1298px] px-4 relative" data-aos="zoom-in"> <!-- Ajoutez relative ici pour positionner les éléments absolus par rapport à celui-ci -->
                <div class="text-3xl font-bold text-white">NA
                    @auth <!-- Vérifie si l'utilisateur est connecté -->
                    <span id="logoutMenuBtn" class="ml-2 text-teal-300 cursor-pointer"> <!-- Ajoutez un ID pour le bouton de déconnexion -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block transform rotate-90"
                                viewBox="0 0 20 20" fill="currentColor"> <!-- Ajoute une icône de flèche déroulante -->
                                <path fill-rule="evenodd"
                                    d="M10 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1.447-.895l8 6a1 1 0 0 1 0 1.79l-8 6A1 1 0 0 1 10 18z"></path>
                            </svg>
                            <div id="logoutMenu"
                                class="absolute mt-2 bg-gray-900 border border-gray-300 rounded-md shadow-md hidden"> <!-- Utilisez top-full pour positionner le menu en dessous de la flèche déroulante -->
                                <a href="{{ route('logout') }}"
                                    class="block px-4 py-2 text-sm text-white hover:bg-red-800 hover:text-white transition duration-500" onclick="event.preventDefault(); document.getElementById('logout-form').submit();"> <!-- Lien de déconnexion -->
                                    {{ __('Log Out') }}
                                </a>
                                <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                    style="display: none;">
                                    @csrf
                                </form>
                            </div>
                        </span>
                        @endauth
                </div>
                <button id="hamburgerBtn" class="md:hidden block text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <div id="navLinks" class="hidden md:flex gap-5 justify-between pr-5 text-lg font-medium text-white whitespace-nowrap bebas-neue-regular" style="letter-spacing: 2px" ><div>
                <a href="{{ url('/') }}"  class="hover:text-teal-300">Home</a>
            </div>

            <div>
    <a href="{{ url('/') }}#about" class="hover:text-teal-300">Services</a>
</div>

<div>
    <a href="{{ url('/') }}#projects" class="hover:text-teal-300">Projects</a>
</div>

<div>
    <a href="{{ route('about') }}" class="hover:text-teal-300">About</a>
</div>

<div>
    <a href="{{ route('posts.index') }}" class="text-teal-300 hover:text-teal-300 transition duration-500">News</a>
</div>

<div>
    <a href="{{ route('contact') }}" class="hover:text-teal-300 border border-solid rounded-[20.5px] p-3"> <i class="fas fa-envelope"></i> Contact</a>
</div>

@auth
<div>
    | <a href="{{ url('/dashboard') }}"  class="hover:text-teal-300">Dashboard</a>
</div>
@endauth
    </div>
    </div>

    <div class="flex gap-5 justify-between self-center mt-44 w-full max-w-[1012px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full" data-aos="zoom-in">
                <div class="flex flex-col flex-1 px-5 max-md:max-w-full">
                    <div class="mt-11 text-7xl font-bold text-center text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl">
                    {{ $post->subject }}
                    </div>
                    <div class="hidden mt-10 md:flex flex-wrap gap-5 justify-between self-center mb-20 max-w-[1070px]">
        <img loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
            class="flex-1 w-full aspect-[1.49] fill-sky-200" /> <img loading="lazy"
                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                            class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
                    <img loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                            class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
                    <img loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                            class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
                </div>
        </div>
        </div>

        <div class="flex flex-col items-center px-16 py-12 max-md:px-5 text-white" data-aos="zoom-in">
    <div class="flex justify-center w-full max-w-[1267px] border border-2 border-white bg-gray-800 rounded-lg overflow-hidden">
        <div class="max-w-4xl mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold mb-4 text-center" data-aos="zoom-in">{{ $post->title }}</h1>
            <p class="text-white mb-2 text-center font-semibold" data-aos="zoom-in"><em>{{ $post->subject }}</em></p>
            <p class="text-gray-300 mb-6 text-center" data-aos="zoom-in"><strong>                         <div class="mb-10 inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold text-lg">
    
            </div></p>
            <div class="text-gray-300 mb-6 leading-relaxed" data-aos="zoom-in">
            BRUSSELS —</strong> {!! nl2br(e($post->description)) !!}
            </div>
            @if ($post->photo)
                <div class="mb-6" data-aos="zoom-in">
                    <img src="{{ asset('storage/' . $post->photo) }}" alt="Photo" class="w-full rounded-lg">
                </div>
            @endif
            <a href="{{ route('posts.index') }}" class="inline-block bg-teal-300 hover:bg-teal-400 text-white px-4 py-2 rounded-lg">BACK</a>
        </div>
    </div>
</div>


</div>



<footer class="bg-gray-100 py-12">
    <div class="container mx-auto flex flex-col items-center">
        <div class="border-t border-gray-300"></div>
        <div class="flex flex-col md:flex-row justify-between items-center mt-8 md:items-start md:text-left">
            <div class="w-full md:w-2/3 lg:w-1/3 mb-8 md:mb-0 text-center md:text-left">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">About NA</h2>
                <p class="text-sm text-gray-600">NA is a software engineer and fullstack developer graduated in Belgium.</p>
                <div class="flex items-center mt-6 justify-center md:justify-start">
                    <a href="https://www.instagram.com/natechforge/" target="_blank" rel="noopener noreferrer">
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/949187d7ee1e2afd8a023c671f59d74c39c29d054926767f17b217fed5475910?apiKey=d3784f4c52b7403885832573b3287702&" class="aspect-square w-[50px] hover:bg-teal-300 hover:rounded-full cursor-pointer" />
                    </a>
                    <a href="https://twitter.com/AjariNawfel" target="_blank" rel="noopener noreferrer">
                        <img loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a7d60a3960400d8a490b85c9fa9558bb8a2473d9b8b90dc4a3c6c99c2b361f7f?apiKey=d3784f4c52b7403885832573b3287702&"
                            class="aspect-square w-[50px] hover:bg-teal-300 hover:rounded-full cursor-pointer" />
                    </a>
                    <a href="https://be.linkedin.com/in/nawfel-ajari" target="_blank" rel="noopener noreferrer">
                        <img loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/20b91319aa8c73e3d645eb4aeefedc7f337acd87cc2bcea1a90ca77d18e63440?apiKey=d3784f4c52b7403885832573b3287702&"
                            class="aspect-square w-[50px] hover:bg-teal-300 hover:rounded-full cursor-pointer" />
                    </a>
                </div>
            </div>
            <div class="w-full md:w-1/3 lg:w-1/4 text-center md:text-left">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Contact</h2>
                <div class="text-sm text-gray-600">
                    <p class="mb-2">170 Nijverheidskaai, Anderlecht</p>
                    <p class="mb-2">info@nawfelajari.be</p>
                </div>
            </div>
        </div>
        <div class="border-t border-gray-300 mt-12"></div>
    </div>
</footer>
<script src="{{ asset('/show.js') }}"></script>
</body>

</html>