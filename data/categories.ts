export type Category = {
    name: string;
    emoji: string;
    words: string[];
};

export const categories: Category[] = [
    {
        name: 'Animales',
        emoji: '🐾',
        words: [
            'Perro', 'Gato', 'Elefante', 'Tigre', 'Leon', 'Jirafa', 'Delfin',
            'Aguila', 'Serpiente', 'Cocodrilo', 'Pinguino', 'Lobo', 'Oso',
            'Caballo', 'Tiburon', 'Mono', 'Cebra', 'Buho', 'Tortuga', 'Panda',
            'Rinoceronte', 'Hipopotamo', 'Camello', 'Canguro', 'Koala',
            'Flamenco', 'Loro', 'Pulpo', 'Ballena', 'Foca', 'Gorila',
            'Leopardo', 'Pantera', 'Zorro', 'Conejo', 'Ardilla', 'Murcielago',
            'Medusa', 'Cangrejo', 'Escorpion', 'Iguana', 'Camaleon', 'Halcon',
            'Pelicano', 'Tucan', 'Rana', 'Caracol', 'Mariposa', 'Abeja',
            'Hormiga', 'Arana', 'Salamandra', 'Nutria', 'Mapache', 'Jaguar',
        ],
    },
    {
        name: 'Paises',
        emoji: '🌍',
        words: [
            'Colombia', 'Mexico', 'Argentina', 'Espana', 'Japon', 'Brasil',
            'Francia', 'Italia', 'Alemania', 'Canada', 'Australia', 'Egipto',
            'India', 'Rusia', 'Peru', 'Chile', 'Corea del Sur', 'China',
            'Sudafrica', 'Grecia', 'Turquia', 'Portugal', 'Suecia', 'Noruega',
            'Finlandia', 'Dinamarca', 'Suiza', 'Austria', 'Tailandia',
            'Vietnam', 'Indonesia', 'Filipinas', 'Marruecos', 'Nigeria',
            'Kenia', 'Cuba', 'Panama', 'Ecuador', 'Venezuela', 'Uruguay',
            'Paraguay', 'Bolivia', 'Costa Rica', 'Jamaica', 'Irlanda',
            'Escocia', 'Holanda', 'Belgica', 'Polonia', 'Ucrania',
            'Nueva Zelanda', 'Islandia', 'Croacia', 'Israel', 'Singapur',
        ],
    },
    {
        name: 'Comidas',
        emoji: '🍔',
        words: [
            'Pizza', 'Hamburguesa', 'Sushi', 'Tacos', 'Pasta', 'Arepa',
            'Empanada', 'Paella', 'Ceviche', 'Ramen', 'Hotdog', 'Lasana',
            'Burrito', 'Pollo frito', 'Ensalada', 'Helado', 'Torta', 'Waffle',
            'Pancakes', 'Nachos', 'Croissant', 'Donut', 'Brownie', 'Flan',
            'Churros', 'Quesadilla', 'Sopa', 'Guacamole', 'Hummus', 'Falafel',
            'Curry', 'Dim Sum', 'Gyoza', 'Pad Thai', 'Pho', 'Crepa',
            'Risotto', 'Gazpacho', 'Tamales', 'Pupusas', 'Bandeja Paisa',
            'Asado', 'Croquetas', 'Churrasco', 'Tiramisu', 'Cheesecake',
            'Galletas', 'Popcorn', 'Fondue', 'Kebab', 'Sancocho',
            'Tostada', 'Mole', 'Chicharron', 'Carne asada',
        ],
    },
    {
        name: 'Deportes',
        emoji: '⚽',
        words: [
            'Futbol', 'Baloncesto', 'Tenis', 'Natacion', 'Boxeo', 'Ciclismo',
            'Voleibol', 'Beisbol', 'Golf', 'Surf', 'Skate', 'Rugby',
            'Atletismo', 'Esgrima', 'Karate', 'Gimnasia', 'Esqui',
            'Snowboard', 'Polo', 'Cricket', 'Handball', 'Hockey', 'Judo',
            'Taekwondo', 'Lucha libre', 'Escalada', 'Parkour', 'Remo',
            'Vela', 'Waterpolo', 'Badminton', 'Ping Pong', 'Billar',
            'Boliche', 'Dardos', 'Ajedrez', 'Motocross', 'Formula 1',
            'Rally', 'Buceo', 'Paracaidismo', 'Rafting', 'Kayak',
            'Triatlon', 'Maraton', 'Patinaje', 'Crossfit', 'Yoga',
            'Breakdance', 'Paintball', 'Tiro con arco', 'Salto alto',
            'Lanzamiento de jabalina', 'Capoeira', 'MMA',
        ],
    },
    {
        name: 'Profesiones',
        emoji: '👨‍💼',
        words: [
            'Doctor', 'Abogado', 'Ingeniero', 'Chef', 'Piloto', 'Bombero',
            'Policia', 'Profesor', 'Astronauta', 'Actor', 'Cantante',
            'Arquitecto', 'Dentista', 'Mecanico', 'Veterinario', 'Periodista',
            'Fotografo', 'Programador', 'Cientifico', 'Carpintero',
            'Electricista', 'Plomero', 'Enfermero', 'Farmaceutico', 'Psicologo',
            'Disenador', 'Escritor', 'Pintor', 'Escultor', 'Musico',
            'DJ', 'Cirujano', 'Juez', 'Detective', 'Espia', 'Soldado',
            'Marinero', 'Panadero', 'Carnicero', 'Barbero', 'Sastre',
            'Jardinero', 'Agricultor', 'Minero', 'Chofer', 'Cartero',
            'Bibliotecario', 'Locutor', 'Economista', 'Contador',
            'Arqueologo', 'Biologo', 'Traductor', 'Maquillador', 'Modelo',
        ],
    },
    {
        name: 'Peliculas',
        emoji: '🎬',
        words: [
            'Titanic', 'Avatar', 'Matrix', 'Shrek', 'Batman', 'Spider-Man',
            'Harry Potter', 'Star Wars', 'Jurassic Park', 'El Rey Leon',
            'Frozen', 'Toy Story', 'Coco', 'Encanto', 'Iron Man', 'Rapidos y Furiosos',
            'Avengers', 'Indiana Jones', 'Rocky', 'Transformers',
            'Buscando a Nemo', 'Monsters Inc', 'Up', 'Cars', 'Ratatouille',
            'Los Increibles', 'Intensamente', 'Moana', 'Zootopia', 'WALL-E',
            'Gladiador', 'Forrest Gump', 'El Padrino', 'Joker', 'Deadpool',
            'Thor', 'Black Panther', 'Doctor Strange', 'Aquaman', 'Superman',
            'Wonder Woman', 'Venom', 'Minions', 'Kung Fu Panda', 'Madagascar',
            'La Era de Hielo', 'Godzilla', 'King Kong', 'Terminator', 'Alien',
            'E.T.', 'Regreso al Futuro', 'Mi Pobre Angelito', 'Piratas del Caribe',
            'Mision Imposible',
        ],
    },
    {
        name: 'Lugares',
        emoji: '🏛️',
        words: [
            'Playa', 'Montana', 'Hospital', 'Escuela', 'Aeropuerto', 'Biblioteca',
            'Supermercado', 'Cine', 'Estadio', 'Parque', 'Museo', 'Iglesia',
            'Restaurante', 'Gimnasio', 'Centro Comercial', 'Zoologico',
            'Estacion de tren', 'Discoteca', 'Gasolinera', 'Hotel',
            'Farmacia', 'Banco', 'Oficina', 'Fabrica', 'Universidad',
            'Jardin', 'Piscina', 'Acuario', 'Circo', 'Teatro', 'Spa',
            'Cafeteria', 'Panaderia', 'Lavanderia', 'Peluqueria', 'Taller',
            'Cementerio', 'Castillo', 'Palacio', 'Cueva', 'Volcan',
            'Desierto', 'Selva', 'Rio', 'Cascada', 'Isla', 'Faro',
            'Puerto', 'Establo', 'Granero', 'Planetario', 'Observatorio',
            'Refugio', 'Mercado', 'Plaza',
        ],
    },
    {
        name: 'Objetos',
        emoji: '🔧',
        words: [
            'Telefono', 'Computadora', 'Reloj', 'Televisor', 'Guitarra',
            'Paraguas', 'Espejo', 'Llave', 'Maleta', 'Camara', 'Microscopio',
            'Telescopio', 'Brujula', 'Martillo', 'Tijeras', 'Linterna',
            'Candado', 'Calculadora', 'Almohada', 'Extintor', 'Mochila',
            'Bicicleta', 'Patineta', 'Moneda', 'Corona', 'Espada', 'Escudo',
            'Casco', 'Guantes', 'Bufanda', 'Sombrero', 'Gafas', 'Anillo',
            'Collar', 'Trompeta', 'Piano', 'Bateria', 'Violin', 'Microfono',
            'Audifonos', 'Control remoto', 'Sarten', 'Cuchillo', 'Tenedor',
            'Vela', 'Globo', 'Dado', 'Rompecabezas', 'Binoculares', 'Ancla',
            'Balon', 'Trofeo', 'Bandera', 'Campana', 'Silbato',
        ],
    },
];

export function getRandomWord(categoryIndex: number): string {
    const category = categories[categoryIndex];
    return category.words[Math.floor(Math.random() * category.words.length)];
}
