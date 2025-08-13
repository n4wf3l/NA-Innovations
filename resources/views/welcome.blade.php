<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Home — NA</title>
    <link rel="icon" href="{{ asset('NAlogo2.png') }}" type="image/x-icon" />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="//unpkg.com/alpinejs" defer></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spinkit/2.0.1/spinkit.min.css">
    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('/welcome.css') }}">
    @vite('resources/css/app.css')
</head>

<body>
<a href="#" id="scrollToTop"><i class="fas fa-arrow-up"></i></a>
    <div id="app">
<div class="flex flex-col py-12 bg-gray-900">
    <!-- Logo NA with icone to Logout if Connected -->
    <div class="flex justify-between items-center self-center w-full max-w-[1298px] px-4 relative" data-aos="zoom-in">
                <div class="text-3xl font-bold text-white">NA
                    @auth 
                    <span id="logoutMenuBtn" class="ml-2 text-teal-300 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block transform rotate-90"
                                viewBox="0 0 20 20" fill="currentColor"> 
                                <path fill-rule="evenodd"
                                    d="M10 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1.447-.895l8 6a1 1 0 0 1 0 1.79l-8 6A1 1 0 0 1 10 18z"></path>
                            </svg>
                            <div id="logoutMenu"
                                class="absolute mt-2 bg-gray-900 border border-gray-300 rounded-md shadow-md hidden">
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
                <!-- Bouton du menu hamburger (visible uniquement sur les petits écrans) -->
                <button id="hamburgerBtn" class="md:hidden block text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
 
                <div id="navLinks" class="hidden md:flex gap-5 justify-between pr-5 text-lg font-medium text-white whitespace-nowrap bebas-neue-regular" style="letter-spacing: 2px">
    <div>
        <a href="" class="text-teal-300 hover:text-teal-300 transition duration-500">Home</a>
    </div>
    <div>
        <a href="#about" class="hover:text-teal-300 transition duration-500">Services</a>
    </div>
    <div>
    <a href="#projects" class="hover:text-teal-300">Projects</a>
</div>
    <div>
        <a href="{{ route('about') }}" class="hover:text-teal-300 transition duration-500">About</a>
    </div>
    <div>
        <a href="{{ route('posts.index') }}" class="hover:text-teal-300 transition duration-500">News</a>
    </div>
    <div>
        <a href="{{ route('contact') }}" class="hover:text-teal-300 transition duration-500 border border-solid rounded-[20.5px] p-3"> <i class="fas fa-envelope"></i> Contact</a>
    </div>
    @auth
    <div>|
        <a href="{{ url('/dashboard') }}" class="hover:text-teal-300">Dashboard</a>
    </div>
    @endauth
</div>

            </div>

            
       <div class="flex gap-5 justify-between items-center self-center mt-44 w-full max-w-[1012px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full border border-white p-4 relative" data-aos="zoom-in">
    <div class="flex flex-col flex-1 px-5 max-md:max-w-full mx-1">
        <div class="text-sm md:text-base lg:text-xl font-medium text-neutral-400 max-md:max-w-full bebas-neue-regular hover:text-teal-300 transition-colors duration-700" style="letter-spacing: 2px">
            Web Development, Mobile, and Software | Video Editing and Graphic Design | Photography
        </div>
        <div class="mt-11 text-8xl font-bold text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl hover:text-teal-300 transition-colors duration-700">
            Innovative solutions
            <br />
            designed for you.
        </div>
        <div class="mt-11 text-xs lg:text-sm font-bold text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl flex items-center">
    
            <p class="mt-10 ml-3 text-sm lg:text-base bebas-neue-regular hover:text-teal-300 transition-colors duration-700" style="letter-spacing: 1px">From idea to application</p>
        </div>
    </div>

    <button id="background-toggle-button" class="toggle-button z-10">
        <span id="toggle-icon" class="toggle-icon">🌙</span>
    </button>

<div class="flex flex-col items-center justify-center w-full gap-8">
    <div class="relative hover-trigger" style=" height: auto;"> <!-- Force largeur -->
        <div class="relative">
            <img src="{{ asset('bitmoji.png') }}" 
                 alt="Bitmoji" 
                 class="w-full h-auto max-md:hidden transition-all duration-500 ease-in-out hover:opacity-0"
                 style="width: 15rem; position: absolute; top: 0; left: 0;" 
                 id="bitmoji-image">
            <img src="{{ asset('bitmoji2.png') }}" 
                 alt="Bitmoji Hover" 
                 class="w-full h-auto max-md:hidden transition-all duration-500 ease-in-out"
                 id="bitmoji-image-hover"
                 style="width: 16rem;">
        </div>
    </div>

    <!-- Social media -->
    <div class="flex gap-8 items-center justify-center" data-aos="zoom-in">
        <a href="https://www.instagram.com/na.innovations/" class="w-24 h-24 hover:bg-teal-300 hover:rounded-full cursor-pointer ">    
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/949187d7ee1e2afd8a023c671f59d74c39c29d054926767f17b217fed5475910?apiKey=d3784f4c52b7403885832573b3287702&" class="w-full h-full brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"/>
        </a>
        <a href="https://twitter.com/AjariNawfel" class="w-24 h-24 hover:bg-teal-300 hover:rounded-full cursor-pointer">   
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/a7d60a3960400d8a490b85c9fa9558bb8a2473d9b8b90dc4a3c6c99c2b361f7f?apiKey=d3784f4c52b7403885832573b3287702&" class="w-full h-full brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300" />
        </a>
        <a href="https://be.linkedin.com/in/nawfel-ajari" class="w-24 h-24 hover:bg-teal-300 hover:rounded-full cursor-pointer">   
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/20b91319aa8c73e3d645eb4aeefedc7f337acd87cc2bcea1a90ca77d18e63440?apiKey=d3784f4c52b7403885832573b3287702&" class="w-full h-full brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300" />
        </a>
    </div>
</div>


</div>

</div>

<div class="messages-container bg-teal-300 text-white text-3xl bebas-neue-regular" style="letter-spacing:3px" id="about">
    <ul class="messages-list">
        @foreach($messages as $message)
            <li>{{ $message->content }}</li>
        @endforeach
    </ul>
</div>


<div class="flex flex-col max-w-full w-full mt-0 mb-0 bebas-neue-regular p-5"
     style="background-image: url('{{ asset('codingpicture.jpg') }}');
            background-size:cover;
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-position: center;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 2;">

    <!-- Titre principal -->
    <h2 class="text-center ml-4 md:ml-16 mr-4 md:mr-16 mt-10 text-9xl font-semibold text-white max-md:max-w-full max-md:text-4xl max-md:text-center bebas-neue-regular" style="letter-spacing: 2px" data-aos="zoom-in">
        Our Services
    </h2>
    <hr class="mt-10 border-white/50">

    <!-- Contenu -->
    <div class="grid grid-cols-1 md:grid-cols-2 mr-2 ml-2">

        <!-- Left column -->
        <div class="col-span-1 max-w-xl mx-auto text-white text-left md:text-left" style="letter-spacing: 0px">

            <div class="mt-8 mb-6" data-aos="zoom-in">
                <h2 class="text-3xl bebas-neue-regular"><i class="fas fa-globe mr-2"></i>Custom Development</h2>
                <p class="text-2xl mt-4">
                    I’m Nawfel Ajari, full-stack developer and founder of <span class="text-teal-300">NA Innovations</span>.  
                    I specialize in building <span class="text-teal-300">high-performing</span>, <span class="text-teal-300">conversion-focused</span> digital solutions — from custom websites and software to mobile applications.  
                    Whether it’s a showcase site, e-commerce platform, interactive web app, or <span class="text-teal-300">SaaS</span>, I take your idea from concept to deployment, ensuring both quality and scalability.
                </p>
            </div>

            <div class="mb-6" data-aos="zoom-in">
                <h3 class="text-3xl bebas-neue-regular"><i class="fas fa-mobile-alt mr-2"></i>Mobile Applications</h3>
                <p class="text-2xl mt-4">
                    I design and develop <span class="text-teal-300">native</span>, <span class="text-teal-300">hybrid</span>, and <span class="text-teal-300">PWA</span> applications with seamless user experiences across all devices.  
                    My process includes <span class="text-teal-300">planning</span>, <span class="text-teal-300">design</span>, development, testing, and ongoing maintenance to ensure long-term success.
                </p>
            </div>

        </div>

        <!-- Right column -->
        <div class="col-span-1 max-w-xl mx-auto text-white text-left md:text-left" style="letter-spacing: 0px">

            <div class="mt-8 mb-6" data-aos="zoom-in">
                <h2 class="text-3xl bebas-neue-regular"><i class="fas fa-palette mr-2"></i>Design, Video & Photography</h2>
                <p class="text-2xl mt-4">
                    For creative needs such as <span class="text-teal-300">graphic design</span>, <span class="text-teal-300">video editing</span>, and photography,  
                    I work with a <span class="text-teal-300">trusted network of experts</span> who deliver exceptional quality.  
                    This way, you benefit from premium results while having me as your <span class="text-teal-300">single point of contact</span> throughout the entire project.
                </p>
            </div>

            <div class="mt-8 mb-6" data-aos="zoom-in">
                <h2 class="text-3xl bebas-neue-regular">🚀 Let’s Build Something Great</h2>
                <p class="text-2xl mt-4">
                    Your vision, my code. Together, we can turn your ideas into powerful <span class="text-teal-300">digital products</span> that stand out.
                </p>
            </div>

        </div>
    </div>

    <!-- Bouton centré en bas avec plus de padding et margin -->
<div class="flex justify-center mt-12 mb-20">
    <a href="/contact"
       class="px-8 py-5 bg-teal-300 text-white text-xl font-semibold rounded-full border border-teal-400 transition-all duration-200 ease-in-out transform hover:scale-105 hover:text-black hover:bg-teal-400">
        Contact Us
    </a>
</div>

</div>


</div>



<section class="py-16 text-black bg-gray-100" id="projects">
<div class="text-center ml-4 md:ml-16 mr-4 md:mr-16 mt-20 text-9xl font-semibold text-black max-md:max-w-full max-md:text-4xl max-md:text-center bebas-neue-regular" style="letter-spacing: 2px" data-aos="zoom-in">
    Our Projects
</div>
<hr class="mt-8">
<h1 class="text-2xl font-semibold text-center mt-12 p-2 bebas-neue-regular" style="letter-spacing: 2px" data-aos="zoom-in">💼 Published Websites</h1>
<div class="container mx-auto text-lg text-center max-md:max-w-full mt-8 p-4" data-aos="zoom-in">
    <p class="mb-4">Explore our portfolio of custom websites designed with precision and creativity for businesses across various industries.</p>
    <p class="mb-4">Each project showcases our commitment to quality, attention to detail, and ability to transform client visions into powerful online experiences.</p>
</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 lg:px-20">
        @foreach ($projets as $projet)
        <div class="flex flex-col p-2 relative transition-all bg-white border-2 hover:border-black border-gray rounded-3xl">
    <img src="{{ asset('storage/' . $projet->image) }}" alt="Project Image" class="w-full h-60 object-cover rounded-t-3xl" data-aos="zoom-in">
    @auth <!-- Check if the user is authenticated -->
        <form id="deleteForm{{ $projet->id }}" action="{{ route('projets.destroy', $projet->id) }}" method="POST" class="absolute top-2 right-2">
            @csrf
            @method('DELETE')
            <button type="submit" onclick="deleteProjet('{{ $projet->id }}')" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Delete</button>
        </form>
    @endauth
            <div class="p-2 flex flex-row">
                <img src="{{ asset('seo-and-web.png') }}" width="20px" class="self-center icons mr-2" alt="team icon" />
                <h4 class="text-lg font-semibold">{{ $projet->nom_societe }}</h4>
            </div>
            <div class="flex flex-row items-end justify-between">
                <div class="flex flex-col mr-4">
                    <h5 class="text-xl font-bold ml-4">
                        {{ $projet->type_societe }}
                    </h5>
                </div>
                <div class="flex flex-col ">
                    <span class="text-sm text-gray-500 flex flex-row mr-5">
                        <img src="{{ asset('page.png') }}" width="20px" class="self-center icons mr-2" alt="team icon" />
                        {{ $projet->type_site }}
                    </span>
                    <span class="text-sm text-gray-500 flex flex-row mt-1">
                        <img src="{{ asset('location.png') }}" width="20px" class="self-center icons mr-2" alt="team icon" />
                        {{ $projet->lieu }}
                    </span>
                </div>
            </div>
            <div class="flex flex-row items-center justify-between px-6 py-2 my-4 bg-gray-100 rounded-xl">
                <div class="flex flex-col">
                    <img src="{{ asset('speedometer.png') }}" class="self-center icons" alt="development time icon" />
                    <span class="ml-2">{{ $projet->jours_developpement }} D</span>
                </div>
                <div class="flex flex-col">
                    <img src="{{ asset('coding.png') }}" width="40px" class="self-center icons" alt="team icon" />
                    <span class="ml-2">
                        {{ $projet->langage_programmation }}
                    </span>
                </div>
                <div class="flex flex-col">
                    <img src="{{ asset('star.png') }}" width="40px" class="self-center icons" alt="team icon" />
                    <span>
                        {{ $projet->etoiles }}
                    </span>
                </div>
                <div class="flex flex-col">
                    <img src="{{ asset('users.png') }}" class="self-center icons" alt="team icon" />
                    <span class="ml-3"> {{ $projet->nombre_collaborateurs }}</span>
                </div>
            </div>
            <a href="{{ $projet->lien }}" class="bebas-neue-regular transition duration-150 hover:duration-150 block w-full px-4 py-2 font-medium text-center text-black transition-colors border-2 border-black rounded-3xl hover:bg-teal-300 hover:text-white" style="letter-spacing:2px">
                VISIT THE WEBSITE
            </a>
        </div>
        @endforeach
    </div>
</section>


<section class="py-16 text-black bg-gray-900">
<h1 class="text-2xl font-semibold text-center mt-12 p-2 bebas-neue-regular text-white" style="letter-spacing: 2px" data-aos="zoom-in">🌱 Open Source Projects</h1>
<div class="container mx-auto text-lg text-center max-md:max-w-full mt-8 p-4" data-aos="zoom-in">
    <p class="mb-4 text-white">Discover my collection of open source projects created using various programming languages and innovative solutions.</p>
    <p class="mb-4 text-white">These academic and personal initiatives showcase my technical skills and commitment to knowledge sharing in the developer community.</p>
</div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 lg:px-20">
        @foreach ($academicProjects as $academicProjet)
        <div class="flex flex-col p-2 relative transition-all bg-white border-2 hover:border-black border-gray rounded-3xl">
    <img src="{{ asset('storage/' . $academicProjet->image) }}" alt="AcademicProject Image" class="w-full h-60 object-cover rounded-t-3xl" data-aos="zoom-in">
    @auth <!-- Check if the user is authenticated -->
        <form id="deleteForm{{ $academicProjet->id }}" action="{{ route('academic_projets.destroy', $academicProjet->id) }}" method="POST" class="absolute top-2 right-2">
            @csrf
            @method('DELETE')
            <button type="submit" onclick="deleteAcademicProjet('{{ $academicProjet->id }}')" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Delete</button>
        </form>
    @endauth

            <div class="p-2 flex flex-row">
                <img src="{{ asset('seo-and-web.png') }}" width="20px" class="self-center icons mr-2" alt="team icon" />
                <h4 class="text-lg font-semibold">{{ $academicProjet->nom_societe }}</h4>
            </div>
            <div class="flex flex-row items-end justify-between">
                <div class="flex flex-col mr-4">
                    <h5 class="text-xl font-bold ml-4">
                        {{ $academicProjet->type_societe }}
                    </h5>
                </div>
                <div class="flex flex-col ">
                    <span class="text-sm text-gray-500 flex flex-row mr-5">
                        <img src="{{ asset('page.png') }}" width="20px" class="self-center icons mr-2" alt="team icon" />
                        {{ $academicProjet->type_site }}
                    </span>
                    <span class="text-sm text-gray-500 flex flex-row mt-1">
                        <img src="{{ asset('location.png') }}" width="20px" class="self-center icons mr-2" alt="team icon" />
                        {{ $academicProjet->lieu }}
                    </span>
                </div>
            </div>
            <div class="flex flex-row items-center justify-between px-6 py-2 my-4 bg-gray-100 rounded-xl">
                <div class="flex flex-col">
                    <img src="{{ asset('speedometer.png') }}" class="self-center icons" alt="development time icon" />
                    <span class="ml-2">{{ $academicProjet->jours_developpement }} D</span>
                </div>
                <div class="flex flex-col">
                    <img src="{{ asset('coding.png') }}" width="40px" class="self-center icons" alt="team icon" />
                    <span class="ml-1">
                        {{ $academicProjet->langage_programmation }}
                    </span>
                </div>
                <div class="flex flex-col">
                    <img src="{{ asset('star.png') }}" width="40px" class="self-center icons" alt="team icon" />
                    <span>
                        {{ $academicProjet->etoiles }}
                    </span>
                </div>
                <div class="flex flex-col">
                    <img src="{{ asset('users.png') }}" class="self-center icons" alt="team icon" />
                    <span class="ml-3"> {{ $academicProjet->nombre_collaborateurs }}</span>
                </div>
            </div>
            <a href="{{ $academicProjet->lien }}" class="bebas-neue-regular transition duration-150 hover:duration-150 block w-full px-4 py-2 font-medium text-center text-black transition-colors border-2 border-black rounded-3xl hover:bg-teal-300 hover:text-white" style="letter-spacing:3px">
               TAKE A LOOK ON GITHUB
            </a>
        </div>
        @endforeach
    </div>
</section>


@include('components.footer')
<script src="{{ asset('/welcome.js') }}"></script>
</body>

</html>