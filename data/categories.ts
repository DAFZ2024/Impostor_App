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
            'Perro', 'Gato', 'Elefante', 'Tigre', 'León', 'Jirafa', 'Delfín',
            'Águila', 'Serpiente', 'Cocodrilo', 'Pingüino', 'Lobo', 'Oso',
            'Caballo', 'Tiburón', 'Mono', 'Cebra', 'Búho', 'Tortuga', 'Panda',
        ],
    },
    {
        name: 'Países',
        emoji: '🌍',
        words: [
            'Colombia', 'México', 'Argentina', 'España', 'Japón', 'Brasil',
            'Francia', 'Italia', 'Alemania', 'Canadá', 'Australia', 'Egipto',
            'India', 'Rusia', 'Perú', 'Chile', 'Corea del Sur', 'China',
            'Sudáfrica', 'Grecia',
        ],
    },
    {
        name: 'Comidas',
        emoji: '🍔',
        words: [
            'Pizza', 'Hamburguesa', 'Sushi', 'Tacos', 'Pasta', 'Arepa',
            'Empanada', 'Paella', 'Ceviche', 'Ramen', 'Hotdog', 'Lasaña',
            'Burrito', 'Pollo frito', 'Ensalada', 'Helado', 'Torta', 'Waffle',
            'Pancakes', 'Nachos',
        ],
    },
    {
        name: 'Deportes',
        emoji: '⚽',
        words: [
            'Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Boxeo', 'Ciclismo',
            'Voleibol', 'Béisbol', 'Golf', 'Surf', 'Skate', 'Rugby',
            'Atletismo', 'Esgrima', 'Karate', 'Gimnasia', 'Esquí',
            'Snowboard', 'Polo', 'Cricket',
        ],
    },
    {
        name: 'Profesiones',
        emoji: '👨‍💼',
        words: [
            'Doctor', 'Abogado', 'Ingeniero', 'Chef', 'Piloto', 'Bombero',
            'Policía', 'Profesor', 'Astronauta', 'Actor', 'Cantante',
            'Arquitecto', 'Dentista', 'Mecánico', 'Veterinario', 'Periodista',
            'Fotógrafo', 'Programador', 'Científico', 'Carpintero',
        ],
    },
    {
        name: 'Películas',
        emoji: '🎬',
        words: [
            'Titanic', 'Avatar', 'Matrix', 'Shrek', 'Batman', 'Spider-Man',
            'Harry Potter', 'Star Wars', 'Jurassic Park', 'El Rey León',
            'Frozen', 'Toy Story', 'Coco', 'Encanto', 'Iron Man', 'Rapidos y Furiosos',
            'Avengers', 'Indiana Jones', 'Rocky', 'Transformers',
        ],
    },
    {
        name: 'Lugares',
        emoji: '🏛️',
        words: [
            'Playa', 'Montaña', 'Hospital', 'Escuela', 'Aeropuerto', 'Biblioteca',
            'Supermercado', 'Cine', 'Estadio', 'Parque', 'Museo', 'Iglesia',
            'Restaurante', 'Gimnasio', 'Centro Comercial', 'Zoológico',
            'Estación de tren', 'Discoteca', 'Gasolinera', 'Hotel',
        ],
    },
    {
        name: 'Objetos',
        emoji: '🔧',
        words: [
            'Teléfono', 'Computadora', 'Reloj', 'Televisor', 'Guitarra',
            'Paraguas', 'Espejo', 'Llave', 'Maleta', 'Cámara', 'Microscopio',
            'Telescopio', 'Brújula', 'Martillo', 'Tijeras', 'Linterna',
            'Candado', 'Calculadora', 'Almohada', 'Extintor',
        ],
    },
];

export function getRandomWord(categoryIndex: number): string {
    const category = categories[categoryIndex];
    return category.words[Math.floor(Math.random() * category.words.length)];
}
