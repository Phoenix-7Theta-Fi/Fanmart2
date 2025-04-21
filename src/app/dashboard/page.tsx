'use client';

'use client';

import { useState } from 'react'; // Import useState

// Removed useEffect, createClient as they are no longer needed for this static version
// import { useEffect } from 'react';
// import { createClient } from '@/lib/supabase'; 

// Define section names type for state management
type SectionName = 'hotTopics' | 'events' | 'fanTheories' | 'fanPage' | 'comicSuggestions' | 'blog' | 'artStudio' | 'threads' | 'whatsNew' | null; // Added 'whatsNew'

function DashboardContent() {
  const [activeSection, setActiveSection] = useState<SectionName>(null); // Single state to manage active section

  // --- Placeholder Data ---
  const hotTopics = [
    { id: 1, title: "Latest 'Mega Mutant' movie: Hit or Miss?", comments: 152, category: "Movies", color: "amber" },
    { id: 2, title: "Speculation: Next big villain in 'Cosmic Crusaders'?", comments: 89, category: "Comics", color: "cyan" },
    { id: 3, title: "Top 5 rarest variant covers this month!", comments: 45, category: "Collecting", color: "amber" },
    { id: 4, title: "Debate: Which artist defined the 'Silver Age' best?", comments: 210, category: "History", color: "cyan" },
    { id: 5, title: "New 'Shadow Ninja' Anime Season Announced!", comments: 188, category: "Anime", color: "amber" },
    { id: 6, title: "Manga Sales Surge: What's driving the boom?", comments: 76, category: "Manga", color: "cyan" },
  ];

  // Placeholder data for Global Events - replace with actual data fetching later
  const globalEvents = [
    { id: 1, name: "Tokyo Anime Fest", date: "Oct 15-17, 2025", location: "Tokyo, Japan", color: "cyan" },
    { id: 2, name: "Comic Con International", date: "July 21-24, 2025", location: "San Diego, USA", color: "amber" },
    { id: 3, name: "Angoulême Int'l Comics Festival", date: "Jan 26-29, 2026", location: "Angoulême, France", color: "cyan" },
    { id: 4, name: "Anime Expo", date: "July 1-4, 2025", location: "Los Angeles, USA", color: "amber" },
  ];
  const fanTheoriesData = [
    { id: 1, title: "Theory: Is Character X secretly Character Y's parent?", upvotes: 255, category: "Comics", color: "amber" },
    { id: 2, title: "Anime Ending Explained: What *really* happened?", upvotes: 180, category: "Anime", color: "cyan" },
  ];
  const fanPageData = [ { id: 1, name: "My Hero Academia Fans", members: 12000, color: "amber" }, { id: 2, name: "Spider-Verse Central", members: 8500, color: "cyan" } ];
  const comicSuggestionsData = [ { id: 1, title: "Reading Order: The Infinity Saga", difficulty: "Medium", color: "amber" }, { id: 2, title: "Underrated Manga Gems You Must Read", genre: "Slice of Life", color: "cyan" } ];
  const blogData = [ { id: 1, title: "The Evolution of Shojo Manga", author: "AnimeExpert", date: "Apr 20, 2025", color: "amber" }, { id: 2, title: "Why Golden Age Comics Still Matter", author: "ComicHistorian", date: "Apr 18, 2025", color: "cyan" } ];
  const artStudioData = [ { id: 1, title: "My latest Spider-Gwen sketch", artist: "ArtFan123", likes: 500, color: "amber" }, { id: 2, title: "Digital painting of Titan battle", artist: "AnimePainter", likes: 750, color: "cyan" } ];
  const threadsData = [ { id: 1, title: "r/comicbooks - Weekly Pull List Discussion", posts: 300, color: "amber" }, { id: 2, title: "r/anime - What are you watching this season?", posts: 500, color: "cyan" } ];
  const whatsNewData = [ // Added placeholder data for What's New
    { id: 1, title: "New Feature: Dark Mode Added!", date: "Apr 21, 2025", type: "Site Update", color: "amber" },
    { id: 2, title: "Community Guidelines Updated", date: "Apr 15, 2025", type: "Announcement", color: "cyan" },
  ];
  // --- End Placeholder Data ---

  // Function to get Tailwind classes based on color string using CSS variables
  const getCategoryClasses = (color: string) => {
    switch (color) {
      case 'amber':
        // Using lighter shades for background and border, darker for text
        return 'bg-amber-100 text-amber-800 border-amber-300'; 
      case 'cyan':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Helper function to create button props
  const getButtonProps = (sectionName: SectionName, label: string, emoji: string, colorClass: string, hoverColorClass: string, ringColorClass: string) => {
    const isActive = activeSection === sectionName;
    // Keep the label consistent, only change styling based on isActive
    return {
      onClick: () => setActiveSection(isActive ? null : sectionName),
      className: `px-4 py-2 text-sm md:px-6 md:py-3 font-bold rounded-lg border-2 border-[var(--neutral-dark)] shadow-[3px_3px_0px_var(--neutral-dark)] hover:shadow-[4px_4px_0px_var(--neutral-dark)] transition-all duration-150 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isActive ? `bg-opacity-80 ${hoverColorClass.replace('hover:','')} text-white ${ringColorClass}` : `${colorClass} text-white ${hoverColorClass} ${ringColorClass}`}`, // Use bg-opacity or slightly different active color
      style: { fontFamily: "'Comic Neue', sans-serif" },
      children: `${label} ${emoji}` // Always show label + emoji
    };
  };

  return (
    // Using a very light yellow from the theme's accent color palette
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8"> 
      <div className="max-w-6xl mx-auto flex flex-col items-center"> {/* Increased max-width */}

        {/* Container for Toggle Buttons - Allow wrapping */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
          {/* Pass children directly via getButtonProps */}
          <button {...getButtonProps('hotTopics', 'Hot Topics', '🔥', 'bg-[var(--primary-amber)]', 'hover:bg-amber-600', 'ring-amber-500')} />
          <button {...getButtonProps('events', 'Global Events', '🌍', 'bg-[var(--secondary-cyan)]', 'hover:bg-cyan-600', 'ring-cyan-500')} />
          <button {...getButtonProps('fanTheories', 'Fan Theories', '🤔', 'bg-[var(--primary-amber)]', 'hover:bg-amber-600', 'ring-amber-500')} />
          <button {...getButtonProps('fanPage', 'Fan Pages', '👥', 'bg-[var(--secondary-cyan)]', 'hover:bg-cyan-600', 'ring-cyan-500')} />
          <button {...getButtonProps('comicSuggestions', 'Reading Orders', '📚', 'bg-[var(--primary-amber)]', 'hover:bg-amber-600', 'ring-amber-500')} />
          <button {...getButtonProps('blog', 'Blog', '✍️', 'bg-[var(--secondary-cyan)]', 'hover:bg-cyan-600', 'ring-cyan-500')} />
          <button {...getButtonProps('artStudio', 'Art Studio', '🎨', 'bg-[var(--primary-amber)]', 'hover:bg-amber-600', 'ring-amber-500')} />
          <button {...getButtonProps('threads', 'Threads', '💬', 'bg-[var(--secondary-cyan)]', 'hover:bg-cyan-600', 'ring-cyan-500')} />
          <button {...getButtonProps('whatsNew', "What's New", '✨', 'bg-[var(--primary-amber)]', 'hover:bg-amber-600', 'ring-amber-500')} /> {/* Added What's New button */}
        </div>
        
        {/* Conditionally Rendered Sections */}
        
        {/* Hot Topics Section */}
        {activeSection === 'hotTopics' && (
          <div className="w-full"> {/* Removed mt-12 as button adds margin */}
            {/* Heading removed as per request */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> 
              {hotTopics.map((topic) => (
                <div 
                key={topic.id}
                // Card style using theme variables for background, border, and shadow
                className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1" 
              >
                <span className={`inline-block ${getCategoryClasses(topic.color)} font-semibold px-3 py-1 rounded-full text-sm mb-4 border`}>
                  {topic.category}
                </span>
                <h3 
                  className="text-xl font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--secondary-cyan)] transition-colors duration-150"
                >
                  {topic.title}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  💬 {topic.comments} Comments
                </p>
              </div>
              ))}
            </div>
          </div>
        )} {/* End Hot Topics Section */}

        {/* Events Section */}
        {activeSection === 'events' && (
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> 
              {globalEvents.map((event) => (
                <div 
                  key={event.id}
                  // Consistent card style
                  className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1" 
                >
                  <span className={`inline-block ${getCategoryClasses(event.color)} font-semibold px-3 py-1 rounded-full text-sm mb-4 border`}>
                    📍 {event.location}
                  </span>
                  <h3 
                    className="text-xl font-semibold text-[var(--foreground)] mb-2" // Removed hover color change for events
                  >
                    {event.name}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    📅 {event.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )} {/* End Events Section */}

        {/* Fan Theories Section */}
        {activeSection === 'fanTheories' && (
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fanTheoriesData.map((theory) => (
                <div key={theory.id} className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
                  <span className={`inline-block ${getCategoryClasses(theory.color)} font-semibold px-3 py-1 rounded-full text-sm mb-4 border`}>{theory.category}</span>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--secondary-cyan)] transition-colors duration-150">{theory.title}</h3>
                  <p className="text-gray-600 text-sm font-medium">👍 {theory.upvotes} Upvotes</p>
                </div>
              ))}
            </div>
          </div>
        )} {/* End Fan Theories Section */}

         {/* Fan Page Section */}
        {activeSection === 'fanPage' && (
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fanPageData.map((page) => (
                <div key={page.id} className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
                   <span className={`inline-block ${getCategoryClasses(page.color)} font-semibold px-3 py-1 rounded-full text-sm mb-4 border`}>Group</span>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--secondary-cyan)] transition-colors duration-150">{page.name}</h3>
                  <p className="text-gray-600 text-sm font-medium">👥 {page.members.toLocaleString()} Members</p>
                </div>
              ))}
            </div>
          </div>
        )} {/* End Fan Page Section */}

        {/* Comic Suggestions Section */}
        {activeSection === 'comicSuggestions' && (
           <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {comicSuggestionsData.map((suggestion) => (
                <div key={suggestion.id} className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
                   <span className={`inline-block ${getCategoryClasses(suggestion.color)} font-semibold px-3 py-1 rounded-full text-sm mb-4 border`}>{suggestion.difficulty || suggestion.genre}</span>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--secondary-cyan)] transition-colors duration-150">{suggestion.title}</h3>
                   {/* Placeholder for more details */}
                </div>
              ))}
            </div>
          </div>
        )} {/* End Comic Suggestions Section */}

        {/* Blog Section */}
        {activeSection === 'blog' && (
           <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogData.map((post) => (
                <div key={post.id} className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
                   <span className={`inline-block ${getCategoryClasses(post.color)} font-semibold px-3 py-1 rounded-full text-sm mb-4 border`}>Blog Post</span>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--secondary-cyan)] transition-colors duration-150">{post.title}</h3>
                  <p className="text-gray-600 text-sm font-medium">By {post.author} - {post.date}</p>
                </div>
              ))}
            </div>
          </div>
        )} {/* End Blog Section */}

        {/* Art Studio Section */}
        {activeSection === 'artStudio' && (
           <div className="w-full">
            {/* Simple placeholder - Art might need image display */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {artStudioData.map((art) => (
                <div key={art.id} className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
                   <span className={`inline-block ${getCategoryClasses(art.color)} font-semibold px-3 py-1 rounded-full text-sm mb-4 border`}>Artwork</span>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--secondary-cyan)] transition-colors duration-150">{art.title}</h3>
                  <p className="text-gray-600 text-sm font-medium">By {art.artist} - ❤️ {art.likes}</p>
                </div>
              ))}
            </div>
          </div>
        )} {/* End Art Studio Section */}

        {/* Threads Section */}
        {activeSection === 'threads' && (
           <div className="w-full">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {threadsData.map((thread) => (
                <div key={thread.id} className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
                   <span className={`inline-block ${getCategoryClasses(thread.color)} font-semibold px-3 py-1 rounded-full text-sm mb-4 border`}>Thread</span>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--secondary-cyan)] transition-colors duration-150">{thread.title}</h3>
                  <p className="text-gray-600 text-sm font-medium">💬 {thread.posts} Posts</p>
                </div>
              ))}
            </div>
          </div>
        )} {/* End Threads Section */}

        {/* What's New Section */}
        {activeSection === 'whatsNew' && (
           <div className="w-full">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {whatsNewData.map((item) => (
                <div key={item.id} className="bg-[var(--neutral-light)] p-6 rounded-lg border-2 border-[var(--neutral-dark)] shadow-[4px_4px_0px_var(--neutral-dark)] hover:shadow-[6px_6px_0px_var(--neutral-dark)] transition-shadow duration-200 cursor-pointer transform hover:-translate-y-1">
                   <span className={`inline-block ${getCategoryClasses(item.color)} font-semibold px-3 py-1 rounded-full text-sm mb-4 border`}>{item.type}</span>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 hover:text-[var(--secondary-cyan)] transition-colors duration-150">{item.title}</h3>
                  <p className="text-gray-600 text-sm font-medium">📅 {item.date}</p>
                </div>
              ))}
            </div>
          </div>
        )} {/* End What's New Section */}

      </div>
    </div>
  );
}

export default DashboardContent;
export { DashboardContent as Dashboard };
