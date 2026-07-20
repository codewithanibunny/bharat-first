"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useAppContext } from "@/providers/AppProvider";

interface User {
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  replies: Comment[];
}

export function CommentsSection({ articleId }: { articleId: string }) {
  const { themeObj } = useAppContext();
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?articleId=${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (parentId?: string) => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, content: newComment, parentId }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`mt-4 ${isReply ? 'ml-8 border-l border-gray-700 pl-4' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white overflow-hidden">
          {comment.user?.image ? (
            <img src={comment.user.image} alt={comment.user.name || "User"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold">{comment.user?.name?.charAt(0) || "U"}</span>
          )}
        </div>
        <div>
          <p className="font-semibold text-sm text-white">{comment.user?.name || "Unknown User"}</p>
          <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm">{comment.content}</p>
      
      {/* Replies */}
      {comment.replies?.map((reply) => renderComment(reply, true))}
    </div>
  );

  return (
    <div className="mt-12 border-t border-gray-800 pt-8">
      <h3 className="text-2xl font-bold font-[var(--font-playfair)] mb-6 text-white">Discussion</h3>
      
      {session ? (
        <div className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your insights..."
            className="w-full bg-[#111111] border border-gray-800 rounded-lg p-4 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <Button 
              onClick={() => handlePostComment()} 
              disabled={submitting || !newComment.trim()}
              variant="primary"
              themeObj={themeObj}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-[#111111] border border-gray-800 rounded-lg text-center">
          <p className="text-gray-400 mb-4">You must be logged in to participate in the discussion.</p>
          <Button variant="outline" onClick={() => window.location.href = '/login'} themeObj={themeObj}>
            Log In to Comment
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((c) => renderComment(c))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts.</p>
        )}
      </div>
    </div>
  );
}
