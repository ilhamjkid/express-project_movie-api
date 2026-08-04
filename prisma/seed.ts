import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "#prisma/client";

const connectionString = `${process.env.DIRECT_URL}`;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

type User = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
};
const users: User[] = [
  {
    name: "Stelle",
    email: "stelle@hoyohsr.com",
    password: "#Stelle1",
    role: "ADMIN",
  },
  {
    name: "Khaslana",
    email: "khaslana@hoyohsr.com",
    password: "#Khas123",
    role: "ADMIN",
  },
];
const movies = [
  {
    title: "The Matrix",
    overview: "A computer hacker learns about the true nature of reality.",
    releaseYear: 1999,
    genres: ["Action", "Sci-Fi"],
    runtime: 136,
    posterUrl: "https://example.com/matrix.jpg",
  },
  {
    title: "Inception",
    overview: "A thief who steals corporate secrets through dream-sharing technology.",
    releaseYear: 2010,
    genres: ["Action", "Sci-Fi", "Thriller"],
    runtime: 148,
    posterUrl: "https://example.com/inception.jpg",
  },
  {
    title: "The Dark Knight",
    overview: "Batman faces the Joker in a battle for Gotham's soul.",
    releaseYear: 2008,
    genres: ["Action", "Crime", "Drama"],
    runtime: 152,
    posterUrl: "https://example.com/darkknight.jpg",
  },
  {
    title: "Pulp Fiction",
    overview: "The lives of two mob hitmen, a boxer, and others intertwine.",
    releaseYear: 1994,
    genres: ["Crime", "Drama"],
    runtime: 154,
    posterUrl: "https://example.com/pulpfiction.jpg",
  },
  {
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space.",
    releaseYear: 2014,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    runtime: 169,
    posterUrl: "https://example.com/interstellar.jpg",
  },
  {
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years.",
    releaseYear: 1994,
    genres: ["Drama"],
    runtime: 142,
    posterUrl: "https://example.com/shawshank.jpg",
  },
  {
    title: "Fight Club",
    overview:
      "An insomniac office worker and a devil-may-care soapmaker form an underground fight club.",
    releaseYear: 1999,
    genres: ["Drama"],
    runtime: 139,
    posterUrl: "https://example.com/fightclub.jpg",
  },
  {
    title: "Forrest Gump",
    overview:
      "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.",
    releaseYear: 1994,
    genres: ["Drama", "Romance"],
    runtime: 142,
    posterUrl: "https://example.com/forrestgump.jpg",
  },
  {
    title: "The Godfather",
    overview: "The aging patriarch of an organized crime dynasty transfers control to his son.",
    releaseYear: 1972,
    genres: ["Crime", "Drama"],
    runtime: 175,
    posterUrl: "https://example.com/godfather.jpg",
  },
  {
    title: "Goodfellas",
    overview: "The story of Henry Hill and his life in the mob.",
    releaseYear: 1990,
    genres: ["Biography", "Crime", "Drama"],
    runtime: 146,
    posterUrl: "https://example.com/goodfellas.jpg",
  },
];

async function main() {
  console.log("[DATABASE] Starting Seeding.");

  const addedUsers = [];
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const addedUser = await prisma.user.create({
      data: { ...user, password: hashedPassword },
    });
    console.log(`[DATABASE] Added User: ${addedUser.name}.`);
    addedUsers.push(addedUser);
  }

  let movieAddedByIndex = 0;
  for (const movie of movies) {
    const creatorId = addedUsers[movieAddedByIndex]?.id as string;
    await prisma.movie.create({ data: { ...movie, creatorId } });
    console.log(`[DATABASE] Added Movie: ${movie.title}.`);
    movieAddedByIndex = movieAddedByIndex === 0 ? 1 : 0;
  }

  console.log("[DATABASE] Seeding Completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("[DATABASE] Seeding Failed.\n", err);
    await prisma.$disconnect();
    process.exit(1);
  });
