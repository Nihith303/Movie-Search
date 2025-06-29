
# 🎬 Movie Search App

A sleek and modern movie search web application that allows users to find detailed information and posters for any movie using the OMDb API. Built with Next.js, React, TypeScript, TailwindCSS, and ShadCN UI.

---

## ⚙️ Setup Instructions

Follow these steps to get the project running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Nihith303/Movie-Search.git
cd YOUR_REPO_NAME
```

### 2. Install Dependencies

> Ensure Node.js and npm are installed on your system.

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of the project and add your OMDb API key:

```env
NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
```

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at:  
👉 `http://localhost:3000`

---

## 🚀 Features

- 🔍 Search for movies by title
- 📄 View detailed movie info (year, genre, plot, ratings, etc.)
- 🖼️ Fetch and display high-quality movie posters
- 💡 Clean, responsive UI
- ⚡ Built with modern frontend technologies

---

## 🛠️ Tech Stack

- **Next.js** – Framework for server-side rendered React apps
- **React** – JavaScript library for building user interfaces
- **TypeScript** – Strongly typed JavaScript
- **TailwindCSS** – Utility-first CSS framework
- **ShadCN UI** – Accessible components built with Tailwind and Radix

---

## 🌐 APIs Used

- **OMDb API** for movie details  
  [http://www.omdbapi.com/](http://www.omdbapi.com/)

- **OMDb Poster API** for fetching movie posters  
  [http://img.omdbapi.com/](http://img.omdbapi.com/)

---

## 🔑 Get an OMDb API Key

1. Visit [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
2. Sign up for a free and You will get API Key to your mail.
3. Actiavte it by click on the Activation link then your good to use the API Key.
4. Copy your API key
5. Create a `.env.local` file in the root directory of the project and add:

   ```env
   NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
   ```

---

## 🙌 Acknowledgements

- [OMDb API](http://www.omdbapi.com/)
- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.dev/)
