<h1>Site publiés</h1>
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

<h1>Projets académiques</h1>
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
</form>