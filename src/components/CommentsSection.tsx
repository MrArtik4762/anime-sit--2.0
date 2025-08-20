import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Comment, CommentsResponse } from '../types';
import { socket } from '../services/socket';
import { getComments, addComment, updateComment, deleteComment, likeComment } from '../services/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { usePrefersReducedMotion } from '../utils/motion';

interface CommentsSectionProps {
  animeId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ animeId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  
  const observer = useRef<IntersectionObserver>();
  const lastCommentRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreComments();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchComments();
    
    // Подключение к Socket.io для конкретного аниме, только если socket доступен
    if (socket && socket.emit && socket.on && socket.off) {
      socket.emit('join anime', animeId);
      
      // Обработка новых комментариев
      const handleNewComment = (comment: Comment) => {
        setComments(prev => [comment, ...prev]);
      };
      
      // Обработка обновленных комментариев
      const handleCommentUpdated = (comment: Comment) => {
        setComments(prev => prev.map(c => c.id === comment.id ? comment : c));
      };
      
      // Обработка удаленных комментариев
      const handleCommentDeleted = (commentId: string) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
      };
      
      // Обработка лайков
      const handleCommentLiked = (comment: Comment) => {
        setComments(prev => prev.map(c => c.id === comment.id ? comment : c));
      };
      
      socket.on('new comment', handleNewComment);
      socket.on('comment updated', handleCommentUpdated);
      socket.on('comment deleted', handleCommentDeleted);
      socket.on('comment liked', handleCommentLiked);
      
      return () => {
        if (socket && socket.emit && socket.on && socket.off) {
          socket.emit('leave anime', animeId);
          socket.off('new comment', handleNewComment);
          socket.off('comment updated', handleCommentUpdated);
          socket.off('comment deleted', handleCommentDeleted);
          socket.off('comment liked', handleCommentLiked);
        }
      };
    }
  }, [animeId, socket]);

  const fetchComments = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const data: CommentsResponse = await getComments(animeId, page, 10);
      
      if (page === 1) {
        setComments(data.comments);
      } else {
        setComments(prev => [...prev, ...data.comments]);
      }
      
      setTotalPages(data.pagination.total);
      setHasMore(page < data.pagination.total);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = () => {
    if (currentPage < totalPages) {
      fetchComments(currentPage + 1);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const comment = await addComment(animeId, newComment);
      setNewComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
    setIsEditing(true);
  };

  const handleUpdateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingText.trim() || !editingCommentId || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const updatedComment = await updateComment(editingCommentId, editingText);
      setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c));
      setEditingCommentId(null);
      setEditingText('');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    
    try {
      const response = await likeComment(commentId);
      setComments(prev => prev.map(c => c.id === response.id ? response : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like comment');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy HH:mm', { locale: ru });
    } catch {
      return dateString;
    }
  };

  const isLikedByUser = (comment: Comment) => {
    return comment.likedBy.some(likedUser => likedUser._id === user?._id);
  };

  // Анимационные варианты
  const commentVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      filter: "blur(10px)",
      transition: { duration: 0.25, ease: "easeIn" }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: {
      opacity: 1,
      height: 'auto',
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <motion.h2
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Комментарии ({comments.length})
      </motion.h2>
      
      {/* Форма добавления комментария */}
      {user && !isEditing && (
        <motion.form
          onSubmit={handleSubmitComment}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Добавьте комментарий..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows={3}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {newComment.length}/1000 символов
              </span>
              <motion.button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </motion.button>
            </div>
          </div>
        </motion.form>
      )}

      {/* Форма редактирования комментария */}
      {isEditing && editingCommentId && (
        <motion.form
          onSubmit={handleUpdateComment}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div className="mb-4">
            <textarea
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows={3}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {editingText.length}/1000 символов
              </span>
              <div className="space-x-2">
                <motion.button
                  type="button"
                  onClick={() => {
                    setEditingCommentId(null);
                    setEditingText('');
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Отмена
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!editingText.trim() || isSubmitting}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Обновление...' : 'Обновить'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.form>
      )}

      {/* Ошибки */}
      {error && (
        <motion.div
          className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Список комментариев */}
      <div className="space-y-4">
        {loading && comments.length === 0 ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                ref={index === comments.length - 1 ? lastCommentRef : null}
                variants={commentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-600/50"
                whileHover={!reduceMotion ? { y: -2, scale: 1.01 } : {}}
              >
                <div className="flex items-start space-x-3">
                  <motion.div
                    className="relative"
                    whileHover={!reduceMotion ? { scale: 1.1, rotate: 5 } : {}}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.img
                      src={comment.userId.avatar.startsWith('http') ? comment.userId.avatar : `${import.meta.env.VITE_API_BASE_URL || 'https://api.anilibria.tv'}${comment.userId.avatar}`}
                      alt={comment.userId.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      whileTap={!reduceMotion ? { scale: 0.9 } : {}}
                    />
                    {/* Анимированный ореол при hover */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-0"
                      whileHover={{ opacity: 0.3 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <motion.span
                          className="font-semibold text-gray-900 dark:text-white"
                          whileHover={{ scale: 1.02 }}
                        >
                          {comment.userId.username}
                        </motion.span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      {user && user._id === comment.userId._id && (
                        <div className="flex space-x-2">
                          <motion.button
                            onClick={() => handleEditComment(comment)}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Редактировать
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Удалить
                          </motion.button>
                        </div>
                      )}
                    </div>
                    <motion.p
                      className="text-gray-800 dark:text-gray-200 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {comment.text}
                    </motion.p>
                    <motion.div
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all duration-300 ${
                          isLikedByUser(comment)
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gradient-to-r from-red-500 to-pink-500 hover:text-white hover:shadow-md'
                        }`}
                        whileHover={!reduceMotion ? { scale: 1.05, y: -1 } : {}}
                        whileTap={!reduceMotion ? { scale: 0.95 } : {}}
                      >
                        <motion.svg
                          className={`w-5 h-5 ${isLikedByUser(comment) ? 'fill-current text-white' : 'text-gray-500'}`}
                          fill={isLikedByUser(comment) ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={isLikedByUser(comment) ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, 0]
                          } : {}}
                          transition={{
                            duration: 0.4,
                            times: [0, 0.5, 1],
                            ease: "easeInOut"
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </motion.svg>
                        <motion.span
                          className="font-medium"
                          key={comment.likes}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {comment.likes}
                        </motion.span>
                        {isLikedByUser(comment) && (
                          <motion.div
                            className="absolute -top-1 -right-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                          >
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </motion.div>
                        )}
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            className="text-center py-8 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {user ? 'Пока нет комментариев. Будьте первым, кто оставит комментарий!' : 'Войдите, чтобы оставлять комментарии'}
          </motion.div>
        )}
      </div>

      {/* Индикатор загрузки */}
      {loading && comments.length > 0 && (
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </motion.div>
      )}

      {!hasMore && comments.length > 0 && (
        <motion.div
          className="text-center py-4 text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Все комментарии загружены
        </motion.div>
      )}
    </div>
  );
};

export default CommentsSection;