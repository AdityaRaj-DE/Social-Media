"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import { useEffect, useRef } from "react";
import FeedPostSkeleton from "./FeedPostSkeleton";



export default function Feed({ initialPosts, currentUserId }: any) {

    const [isOnline, setIsOnline] = useState(true);


    useEffect(() => {
        const update = () => setIsOnline(navigator.onLine);

        update(); // initial check
        window.addEventListener("online", update);
        window.addEventListener("offline", update);

        return () => {
            window.removeEventListener("online", update);
            window.removeEventListener("offline", update);
        };
    }, []);

    const [error, setError] = useState<string | null>(null);


    const [posts, setPosts] = useState<any[]>(initialPosts ?? []);
    const isInitialLoading = posts.length === 0;

    const feedRef = useRef<HTMLDivElement | null>(null);


    const [cursor, setCursor] = useState<string | null>(
        initialPosts?.at(-1)?.id ?? null
    );
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);


    const [loading, setLoading] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [loadMoreError, setLoadMoreError] = useState(false);


    const startY = useRef<number | null>(null);
    const PULL_THRESHOLD = 80; // px
    const MAX_PULL = 120;



    const loadMore = async () => {
        if (loadingMore || !hasMore || !cursor) return;

        setLoadingMore(true);

        try {
            const res = await fetch(`/api/posts?cursor=${cursor}&limit=10`);
            const data = await res.json();

            const raw = Array.isArray(data.posts)
                ? data.posts
                : [];

            const normalized = raw.map((post: any) => ({
                id: post.id ?? post._id,
                content: post.content ?? "",
                imageUrl: post.imageUrl ?? "",
                likes: Array.isArray(post.likes) ? post.likes : [],
                commentsCount: post.commentsCount ?? 0,
                user: post.user
                    ? {
                        id: post.user.id ?? post.user._id,
                        name: post.user.name,
                        profilePic:
                            post.user.profilePic?.startsWith("http")
                                ? post.user.profilePic
                                : "/default-avatar.png",
                    }
                    : null,
            }));

            setPosts((prev) => [...prev, ...normalized]);

            if (normalized.length === 0) {
                setHasMore(false);
            } else {
                setCursor(normalized.at(-1).id);
            }
        } catch (e) {
            console.error("LOAD MORE FAILED", e);
            setLoadMoreError(true);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!loadMoreRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMore();
                }
            },
            {
                root: null,
                rootMargin: "200px", // preload before bottom
                threshold: 0,
            }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [cursor, hasMore, loadingMore]);

    const onTouchStart = (e: React.TouchEvent) => {
        if (window.scrollY !== 0 || isRefreshing) return;
        startY.current = e.touches[0].clientY;
    };

    useEffect(() => {
        const el = feedRef.current;
        if (!el) return;

        const handleTouchMove = (e: TouchEvent) => {
            if (startY.current === null || isRefreshing) return;

            const currentY = e.touches[0].clientY;
            const diff = currentY - startY.current;

            if (diff > 0) {
                e.preventDefault(); // ✅ NOW LEGAL
                setPullDistance(Math.min(diff, MAX_PULL));
            }
        };

        el.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            el.removeEventListener("touchmove", handleTouchMove);
        };
    }, [isRefreshing]);


    const onTouchEnd = async () => {
        if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
            setIsRefreshing(true);
            await refresh(); // 👈 your existing refresh function
            setIsRefreshing(false);
        }

        setPullDistance(0);
        startY.current = null;
    };

    const refresh = async () => {
        if (!isOnline) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/posts?limit=10");

            if (!res.ok) throw new Error("Failed to load feed");

            const data = await res.json();

            const rawPosts = Array.isArray(data.posts)
                ? data.posts
                : Array.isArray(data)
                    ? data
                    : [];

            const normalized = rawPosts.map((post: any) => ({
                id: post.id ?? post._id,
                content: post.content ?? "",
                imageUrl: post.imageUrl ?? "",
                likes: Array.isArray(post.likes) ? post.likes : [],
                commentsCount: post.commentsCount ?? 0,
                user: post.user
                    ? {
                        id: post.user.id ?? post.user._id,
                        name: post.user.name,
                        profilePic:
                            post.user.profilePic?.startsWith("http")
                                ? post.user.profilePic
                                : "/default-avatar.png",
                    }
                    : null,
            }));

            setPosts(normalized);
            setCursor(normalized.at(-1)?.id ?? null);
            setHasMore(true);
        } catch (err) {
            console.error("REFRESH FAILED", err);
            setError("Unable to load feed. Try again.");
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    if (isInitialLoading) {
        return (
            <section className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <FeedPostSkeleton key={i} />
                ))}
            </section>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="text-center space-y-3 py-12">
                <p className="text-sm text-muted">{error}</p>
                <button
                    onClick={refresh}
                    className="text-sm text-accent hover:underline"
                >
                    Retry
                </button>
            </div>
        );
    }
    return (
        <section
            ref={feedRef}
            className="space-y-4"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >



            {/* Pull to refresh (simple version) */}
            <div
                style={{
                    height: pullDistance,
                    transition: isRefreshing ? "height 0.2s ease" : undefined,
                }}
                className="flex items-center justify-center text-xs text-muted"
            >
                {pullDistance > 0 && (
                    <span>
                        {isRefreshing
                            ? "Refreshing…"
                            : pullDistance >= PULL_THRESHOLD
                                ? "Release to refresh"
                                : "Pull to refresh"}
                    </span>
                )}
            </div>

            {/* <button
                onClick={refresh}
                className="text-sm text-muted hover:text-accent"
            >
                {loading ? "Refreshing…" : "Refresh"}
            </button> */}
            {!isOnline && (
                <div className="rounded-lg bg-yellow-500/10 text-yellow-600 text-xs px-3 py-2">
                    You’re offline. Showing cached content.
                </div>
            )}



            {posts.map((post: any) => (
                <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUserId}
                />
            ))}
            {hasMore && (
                <div
                    ref={loadMoreRef}
                    className="h-10 flex items-center justify-center text-xs text-muted"
                >
                    {loadingMore &&
                        [...Array(2)].map((_, i) => (
                            <FeedPostSkeleton key={`more-${i}`} />
                        ))}
                    {loadMoreError && (
                        <button
                            onClick={() => {
                                setLoadMoreError(false);
                                loadMore();
                            }}
                            className="text-sm text-accent hover:underline"
                        >
                            Tap to retry loading more
                        </button>
                    )}
                </div>
            )}

        </section>
    );
}
