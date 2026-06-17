// PlatformPreview.jsx — Real platform preview mockups (IG, FB, LinkedIn)
// Shows how the post will look on each selected platform with correct aspect ratios.

import { useState, useRef, useEffect } from "react";
import { fixMediaUrl } from "../../utils/dropbox";

// ─── ASPECT RATIOS PER PLATFORM ──────────────────────────────────────────────
const PLATFORM_RATIOS = {
  instagram: { post: "1/1", carousel: "1/1", reel: "9/16", storia: "9/16" },
  facebook:  { post: "auto", carousel: "auto", reel: "9/16", storia: "9/16" },
  linkedin:  { post: "1.91/1", carousel: "1/1", reel: "9/16", storia: "9/16" },
};

const PLATFORM_LABELS = {
  instagram: "📸 Instagram",
  facebook:  "📘 Facebook",
  linkedin:  "💼 LinkedIn",
  tiktok:    "🎵 TikTok",
};

function resolveMediaUrls(post) {
  const urls = [];
  if (post.immagineBase64) urls.push(post.immagineBase64);
  else if (post.immagineUrl) urls.push(fixMediaUrl(post.immagineUrl));
  if (post.carouselMedia?.length) urls.push(...post.carouselMedia.map(fixMediaUrl));
  if (post.videoUrl) urls.push(fixMediaUrl(post.videoUrl));
  // Remove duplicates
  return [...new Set(urls)].filter(Boolean);
}

function isVideoUrl(url) {
  if (!url) return false;
  const s = String(url).toLowerCase();
  if (/\.(png|jpg|jpeg|gif|webp|tiff|bmp|svg)(\?|$)/i.test(s)) {
    return false;
  }
  return /\.(mp4|mov|webm|avi|mkv|3gp|flv|wmv)(\?|$)/i.test(s) || 
         s.includes("video") || 
         s.startsWith("blob:") || 
         s.includes("dropbox.com") || 
         s.includes("drive.google.com");
}

// ─── CAROUSEL VIEWER ─────────────────────────────────────────────────────────
function CarouselViewer({ urls, aspectRatio = "1/1" }) {
  const [current, setCurrent] = useState(0);
  const total = urls.length;

  return (
    <div style={{ position: "relative", width: "100%", background: "#000" }}>
      <div style={{ aspectRatio, width: "100%", overflow: "hidden", position: "relative" }}>
        {isVideoUrl(urls[current]) ? (
          <VideoPlayer src={urls[current]} aspectRatio={aspectRatio} />
        ) : (
          <img
            src={urls[current]}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            onError={e => e.target.style.display = "none"}
          />
        )}
      </div>
      {/* Navigation arrows */}
      {total > 1 && current > 0 && (
        <button onClick={() => setCurrent(c => c - 1)}
          className="pp-carousel-arrow pp-carousel-left" aria-label="Previous"
          style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, fontSize: 16, borderRadius: "50%", padding: 0 }}>
          ‹
        </button>
      )}
      {total > 1 && current < total - 1 && (
        <button onClick={() => setCurrent(c => c + 1)}
          className="pp-carousel-arrow pp-carousel-right" aria-label="Next"
          style={{ width: 28, height: 28, minWidth: 28, minHeight: 28, fontSize: 16, borderRadius: "50%", padding: 0 }}>
          ›
        </button>
      )}
      {/* Dots */}
      {total > 1 && (
        <div className="pp-carousel-dots">
          {urls.map((_, i) => (
            <div key={i}
              className={`pp-carousel-dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
      {/* Counter */}
      {total > 1 && (
        <div className="pp-carousel-counter">{current + 1}/{total}</div>
      )}
    </div>
  );
}

// ─── VIDEO PLAYER ────────────────────────────────────────────────────────────
function VideoPlayer({ src, aspectRatio = "9/16" }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [canPlay, setCanPlay] = useState(false);

  function togglePlay() {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }

  return (
    <div style={{ position: "relative", width: "100%", background: "#000", cursor: "pointer" }}
      onClick={togglePlay}>
      <div style={{ aspectRatio, width: "100%", overflow: "hidden" }}>
        <video
          ref={videoRef}
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          onCanPlay={() => setCanPlay(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          autoPlay
          muted
          playsInline
          loop
        />
      </div>
      {!playing && (
        <div className="pp-video-play-overlay" style={{ zIndex: 10 }}>
          <div className="pp-video-play-btn">▶</div>
        </div>
      )}
      {canPlay && playing && (
        <div className="pp-video-controls" style={{ zIndex: 11 }}>
          <button onClick={e => { e.stopPropagation(); if(videoRef.current) videoRef.current.muted = !videoRef.current.muted; }}
            className="pp-video-mute">
            {videoRef.current?.muted ? "🔇" : "🔊"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── INSTAGRAM PREVIEW ───────────────────────────────────────────────────────
function InstagramPreview({ post, projectName, avatarLetter }) {
  const mediaUrls = resolveMediaUrls(post);
  const tipo = post.tipo || "post";
  const isReel = tipo === "reel";
  const isCarousel = tipo === "carousel" || (mediaUrls.length > 1 && !isReel);
  const isStoria = tipo === "storia";
  const ratio = isReel || isStoria ? "9/16" : "1/1";

  return (
    <div className="pp-ig">
      {/* IG Header */}
      {!isStoria && (
        <div className="pp-ig-header">
          <div className="pp-ig-avatar">{avatarLetter}</div>
          <div className="pp-ig-user">
            <div className="pp-ig-username">{projectName}</div>
            {post.pilastro && <div className="pp-ig-location">{post.pilastro}</div>}
          </div>
          <div className="pp-ig-more">⋯</div>
        </div>
      )}

      {/* Media */}
      {isStoria ? (
        <div className="pp-ig-story-frame">
          <div className="pp-ig-story-header">
            <div className="pp-ig-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{avatarLetter}</div>
            <span className="pp-ig-story-user">{projectName}</span>
            <span className="pp-ig-story-time">2h</span>
          </div>
          {mediaUrls[0] && isVideoUrl(mediaUrls[0])
            ? <VideoPlayer src={mediaUrls[0]} aspectRatio="9/16" />
            : <div style={{ aspectRatio: "9/16", width: "100%", background: "#000" }}>
                {mediaUrls[0] && <img src={mediaUrls[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
              </div>
          }
        </div>
      ) : isReel ? (
        <div className="pp-ig-reel-frame">
          {mediaUrls[0] && isVideoUrl(mediaUrls[0])
            ? <VideoPlayer src={mediaUrls[0]} aspectRatio="9/16" />
            : <div style={{ aspectRatio: "9/16", width: "100%", background: "#000" }}>
                {mediaUrls[0] && <img src={mediaUrls[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
                <div className="pp-reel-icon">🎬</div>
              </div>
          }
        </div>
      ) : isCarousel ? (
        <CarouselViewer urls={mediaUrls} aspectRatio="1/1" />
      ) : (
        /* Single post */
        <div style={{ width: "100%", background: "#fff", display: "block" }}>
          {mediaUrls[0] ? (
            isVideoUrl(mediaUrls[0]) ? (
              <VideoPlayer src={mediaUrls[0]} aspectRatio="1/1" />
            ) : (
              <img src={mediaUrls[0]} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
            )
          ) : (
            <div style={{ aspectRatio: "1/1", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", color: "#ccc", fontSize: 48 }}>🖼️</div>
          )}
        </div>
      )}

      {/* Action buttons */}
      {!isStoria && (
        <div className="pp-ig-actions">
          <div className="pp-ig-actions-left">
            <span>♡</span> <span>💬</span> <span>↗</span>
          </div>
          <span>☆</span>
        </div>
      )}

      {/* Caption */}
      {post.caption && !isStoria && (
        <div className="pp-ig-caption">
          <span className="pp-ig-caption-user">{projectName}</span>{" "}
          {post.caption.length > 120 ? post.caption.slice(0, 120) + "..." : post.caption}
        </div>
      )}

      {/* Hashtags */}
      {post.hashtags && !isStoria && (
        <div className="pp-ig-hashtags">{post.hashtags}</div>
      )}
    </div>
  );
}

// ─── FACEBOOK PREVIEW ────────────────────────────────────────────────────────
function FacebookPreview({ post, projectName, avatarLetter }) {
  const mediaUrls = resolveMediaUrls(post);
  const isCarousel = post.tipo === "carousel" || mediaUrls.length > 1;
  const isReel = post.tipo === "reel";

  return (
    <div className="pp-fb">
      {/* FB Header */}
      <div className="pp-fb-header">
        <div className="pp-fb-avatar">{avatarLetter}</div>
        <div className="pp-fb-user">
          <div className="pp-fb-name">{projectName}</div>
          <div className="pp-fb-time">{post.data || "Bozza"} · 🌍</div>
        </div>
        <div className="pp-fb-more">⋯</div>
      </div>

      {/* Caption (FB shows caption before media) */}
      {post.caption && (
        <div className="pp-fb-text">
          {post.caption.length > 200 ? post.caption.slice(0, 200) + "... Altro" : post.caption}
        </div>
      )}

      {/* Media */}
      {isReel ? (
        <div className="pp-fb-reel">
          {mediaUrls[0] && isVideoUrl(mediaUrls[0])
            ? <VideoPlayer src={mediaUrls[0]} aspectRatio="9/16" />
            : <div style={{ aspectRatio: "9/16", width: "100%", background: "#000", maxHeight: 500 }}>
                {mediaUrls[0] && <img src={mediaUrls[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
              </div>
          }
        </div>
      ) : isCarousel ? (
        <CarouselViewer urls={mediaUrls} aspectRatio="auto" />
      ) : (
        <div style={{ width: "100%", background: "#000" }}>
          {mediaUrls[0] ? (
            isVideoUrl(mediaUrls[0]) ? (
              <VideoPlayer src={mediaUrls[0]} aspectRatio="1/1" />
            ) : (
              <img src={mediaUrls[0]} alt="" style={{ width: "100%", maxHeight: 500, objectFit: "contain", display: "block", margin: "0 auto" }} />
            )
          ) : (
            <div style={{ aspectRatio: "1.91/1", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", color: "#bbb", fontSize: 48 }}>🖼️</div>
          )}
        </div>
      )}

      {/* Reactions bar */}
      <div className="pp-fb-reactions">
        <div className="pp-fb-reactions-left">👍 ❤️ 😂</div>
        <div className="pp-fb-reactions-right">Commenta · Condividi</div>
      </div>

      {/* Action bar */}
      <div className="pp-fb-action-bar">
        <button className="pp-fb-action">👍 Mi piace</button>
        <button className="pp-fb-action">💬 Commenta</button>
        <button className="pp-fb-action">↗ Condividi</button>
      </div>
    </div>
  );
}

// ─── LINKEDIN PREVIEW ────────────────────────────────────────────────────────
function LinkedInPreview({ post, projectName, avatarLetter }) {
  const mediaUrls = resolveMediaUrls(post);
  const isCarousel = post.tipo === "carousel" || mediaUrls.length > 1;

  return (
    <div className="pp-li">
      {/* LI Header */}
      <div className="pp-li-header">
        <div className="pp-li-avatar">{avatarLetter}</div>
        <div className="pp-li-user">
          <div className="pp-li-name">{projectName}</div>
          <div className="pp-li-headline">{post.pilastro || "Marketing"} · {post.data || "Bozza"}</div>
        </div>
        <button className="pp-li-follow">+ Segui</button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="pp-li-text">
          {post.caption.length > 180 ? post.caption.slice(0, 180) + "...altro" : post.caption}
        </div>
      )}

      {/* Media */}
      {isCarousel ? (
        <CarouselViewer urls={mediaUrls} aspectRatio="1/1" />
      ) : (
        <div style={{ width: "100%", background: "#f3f2ef" }}>
          {mediaUrls[0] ? (
            isVideoUrl(mediaUrls[0]) ? (
              <VideoPlayer src={mediaUrls[0]} aspectRatio="1/1" />
            ) : (
              <img src={mediaUrls[0]} alt="" style={{ width: "100%", maxHeight: 500, objectFit: "contain", display: "block", margin: "0 auto" }} />
            )
          ) : (
            <div style={{ aspectRatio: "1.91/1", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f2ef", color: "#bbb", fontSize: 48 }}>🖼️</div>
          )}
        </div>
      )}

      {/* Engagement */}
      <div className="pp-li-engagement">
        <span>👍 ❤️ 💡 12</span>
        <span>3 commenti</span>
      </div>

      {/* Actions */}
      <div className="pp-li-actions">
        <button className="pp-li-action">👍 Consiglia</button>
        <button className="pp-li-action">💬 Commenta</button>
        <button className="pp-li-action">↗ Condividi</button>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function PlatformPreview({ post, projectName, project }) {
  const platforms = post.piattaforme || ["instagram"];
  const avatarLetter = (projectName || "N")[0].toUpperCase();

  const renderSinglePreview = (platform) => {
    switch (platform) {
      case "facebook":
        return <FacebookPreview post={post} projectName={projectName} avatarLetter={avatarLetter} />;
      case "linkedin":
        return <LinkedInPreview post={post} projectName={projectName} avatarLetter={avatarLetter} />;
      case "tiktok":
        return <InstagramPreview post={{...post, tipo: "reel"}} projectName={projectName} avatarLetter={avatarLetter} />;
      case "instagram":
      default:
        return <InstagramPreview post={post} projectName={projectName} avatarLetter={avatarLetter} />;
    }
  };

  const displayPlatforms = platforms.length > 0 ? platforms : ["instagram"];

  return (
    <div className="pp-container-grid">
      {/* Side-by-side previews list */}
      <div className="pp-previews-flex">
        {displayPlatforms.map(p => (
          <div key={p} className="pp-preview-column">
            <div className="pp-column-label">
              {PLATFORM_LABELS[p] || p} Preview
            </div>
            <div className="pp-preview-frame">
              {renderSinglePreview(p)}
            </div>
          </div>
        ))}
      </div>

      {/* Post meta info */}
      <div className="pp-meta-bar" style={{ marginTop: 24 }}>
        <span className="pp-meta-type">
          {post.tipo === "carousel" ? "🎠 Carousel" : post.tipo === "reel" ? "🎬 Reel" : post.tipo === "storia" ? "📱 Storia" : "📷 Post"}
        </span>
        {post.data && <span className="pp-meta-date">📅 {post.data}</span>}
        <span className="pp-meta-status" style={{
          color: post.stato === "approvato" ? "#16a34a" : post.stato === "pubblicato" ? "#0ea5e9" : "#64748b"
        }}>
          {post.stato || "bozza"}
        </span>
      </div>
    </div>
  );
}
