import riayaSignInImage from "@/assets/riaya-signin.png";
import rikazFigmaImage from "@/assets/rikaz-figma.png";

export type Project = {
  id: string;
  number: string;
  name: string;
  description: string;
  category: string;
  technologies: string[];
  githubUrl?: string;
  figmaUrl?: string;
  liveUrl?: string;
  image?: string;
  imageAlt?: string;
  featured?: boolean;
  status: string;
  problem?: string;
  solution?: string;
  features?: string[];
  role?: string;
  contributions?: string;
  outcomes?: string;
  published?: boolean;
  filterGroup?: string;
  gallery?: { url: string; caption: string }[];
  documents?: { url: string; name: string }[];
};

/**
 * Every field below comes from inspecting the actual repositories
 * (file tree, source files, GitHub language stats and the live deployment).
 * Nothing here is invented — fields without real evidence are omitted.
 */
export const projects: Project[] = [
  {
    id: "riaya",
    number: "01",
    name: "Ri'aya",
    category: "Healthcare Web Platform",
    description:
      "A role-based hospital management web app for Jordanian hospitals, with separate dashboards for admins, doctors, laboratory, imaging and blood bank teams.",
    technologies: [
      "HTML",
      "JavaScript",
      "Supabase",
      "Tesseract.js OCR",
      "PDF.js",
      "PWA",
      "Tabler Icons",
    ],
    githubUrl: "https://github.com/ahmadabutouq060-cmd/Riaya-Website",
    liveUrl: "https://riaya-website.vercel.app",
    image: riayaSignInImage,
    imageAlt: "Ri'aya sign-in page from the live deployment",
    featured: true,
    status: "Live",
    problem:
      "Hospital departments — reception, doctors on duty, laboratory, imaging and the blood bank — each work in their own silo, so patient requests and results have to be chased manually between teams.",
    solution:
      "One authenticated web platform where every role gets its own dashboard over a shared Supabase database, with realtime channels so requests and results move between departments as they happen.",
    features: [
      "Sign-in with role-based dashboards: Admin, Head Doctor, Duty Doctor, Laboratory, Imaging and Blood Bank",
      "Admin management of doctors and departments",
      "Doctor dashboards with chat, patient lists, tests and scheduling",
      "Laboratory, imaging and blood bank request queues tied to patient records",
      "Realtime updates between departments through Supabase channels",
      "OCR of documents in the browser with Tesseract.js and PDF rendering with PDF.js",
      "Installable as a PWA with a service worker, plus automatic idle logout",
    ],
  },
  {
    id: "aushop",
    number: "02",
    name: "AUShop",
    category: "Desktop Application",
    description:
      "A JavaFX desktop shop application backed by a MySQL/MariaDB database, built as a university course project in NetBeans.",
    technologies: ["Java", "JavaFX", "JDBC", "MySQL / MariaDB", "SQL"],
    githubUrl: "https://github.com/ahmadabutouq060-cmd/AUShop",
    status: "Course project",
    problem:
      "Managing a small shop's users, products and orders from spreadsheets leaves no single place to place an order, track its status or collect customer feedback.",
    solution:
      "A single JavaFX application connected to the au_shop database over JDBC, where users sign in and browse or manage products, orders and feedback from one interface.",
    features: [
      "Login with user roles stored in the database",
      "Product catalogue with category, price and stock quantity",
      "Order placement with quantity, total price and order status",
      "Customer feedback with rating and message",
      "MySQL/MariaDB schema included as an SQL dump (users, products, orders, feedback)",
    ],
  },
  {
    id: "expenses",
    number: "03",
    name: "Flutter Expense Tracker",
    category: "Mobile App",
    description:
      "A Flutter expense tracker where spending is added by category and visualised in a bar chart.",
    technologies: ["Flutter", "Dart", "Material Design", "uuid", "intl"],
    githubUrl: "https://github.com/ahmadabutouq060-cmd/Flutter-App",
    status: "Completed",
    problem:
      "Small day-to-day expenses are easy to record but hard to read back — a plain list says nothing about where the money actually goes.",
    solution:
      "A single-screen app that keeps expenses in app state and renders them as both a list and a category bar chart, so the spending pattern is visible while adding entries.",
    features: [
      "Add an expense with title, amount, date and category",
      "Remove an expense with an undo action",
      "Category bar chart summarising spending",
    ],
  },
  {
    id: "dice",
    number: "04",
    name: "Dice Roller",
    category: "Flutter Practice",
    description:
      "A small Flutter learning app with a gradient background, dice images and a roll button — built while working through Flutter fundamentals.",
    technologies: ["Flutter", "Dart"],
    githubUrl: "https://github.com/ahmadabutouq060-cmd/dice",
    status: "Learning project",
    features: [
      "Custom gradient container widget",
      "Dice face images swapped from a widget action",
      "Reusable styled text widget",
    ],
  },
  {
    id: "rikaz",
    number: "05",
    name: "Rikaz (ركاز)",
    category: "UI/UX Design",
    description:
      "A Figma design exploring a mascot-style character and icon variations for Rikaz, with multiple frames and states laid out side by side.",
    technologies: ["Figma"],
    figmaUrl:
      "https://www.figma.com/design/lrxHpuwZDZ2qEoRqIoQa8g/%D8%B1%D9%83%D8%A7%D8%B2?node-id=0-1",
    image: rikazFigmaImage,
    imageAlt: "Overview of the Rikaz Figma design file showing character frames and icon variants",
    status: "Design file",
  },
];

export const featuredProject = projects.find((project) => project.featured) ?? projects[0];
export const otherProjects = projects.filter((project) => project !== featuredProject);
