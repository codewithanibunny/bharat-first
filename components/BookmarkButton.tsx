"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookmarkIcon } from "lucide-react";

export function BookmarkButton({ articleId }: { articleId: string }) {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      checkBookmark();
    } else {
      setLoading(false);
    }
  }, [session, articleId]);

  const checkBookmark = async () => {
    try {
      const res = await fetch(`/api/bookmarks?articleId=${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error("Failed to check bookmark", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!session) {
      alert("Please log in to bookmark articles.");
      return;
    }

    setLoading(true);
    try {
      if (bookmarked) {
        await fetch(`/api/bookmarks?articleId=${articleId}`, { method: "DELETE" });
        setBookmarked(false);
      } else {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId }),
        });
        setBookmarked(true);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-300 ${
        bookmarked 
          ? "bg-[#FF6B00]/20 text-[#FF6B00]" 
          : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
      aria-label="Bookmark article"
    >
      <BookmarkIcon 
        size={20} 
        className={bookmarked ? "fill-current" : ""} 
      />
    </button>
  );
}
