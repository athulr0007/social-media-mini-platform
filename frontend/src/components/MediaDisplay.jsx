import { Box, IconButton, Slider, Stack, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";

export default function MediaDisplay({ post, maxHeight = 500 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState({});
  const [isMuted, setIsMuted] = useState({});
  const [progress, setProgress] = useState({});
  const [duration, setDuration] = useState({});
  const [showControls, setShowControls] = useState({});
  const videoRefs = useRef({});

  let allMedia = [];
  
  if (post.media) {
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(post.media);
    allMedia = [{ type: isVideo ? "video" : "image", url: post.media }];
  } else {
    const hasImages = post.images && post.images.length > 0;
    const hasVideos = post.videos && post.videos.length > 0;
    
    allMedia = [
      ...(hasImages ? post.images.map((img) => {
        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(img);
        return { type: isVideo ? "video" : "image", url: img };
      }) : []),
      ...(hasVideos ? post.videos.map((vid) => ({ type: "video", url: vid })) : [])
    ];
  }

  if (allMedia.length === 0) return null;

  const currentMedia = allMedia[currentIndex];
  const videoId = `${post._id}-${currentIndex}`;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(prev => ({ ...prev, [id]: true }));
      } else {
        video.pause();
        setIsPlaying(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleMuteToggle = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      video.muted = !video.muted;
      setIsMuted(prev => ({ ...prev, [id]: video.muted }));
    }
  };

  const handleProgressChange = (id, newValue) => {
    const video = videoRefs.current[id];
    if (video) {
      video.currentTime = newValue;
      setProgress(prev => ({ ...prev, [id]: newValue }));
    }
  };

  const handleFullscreen = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    }
  };

  const handleTimeUpdate = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      setProgress(prev => ({ ...prev, [id]: video.currentTime }));
    }
  };

  const handleLoadedMetadata = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      setDuration(prev => ({ ...prev, [id]: video.duration }));
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "background.default",
        borderRadius: allMedia.length === 1 ? 0 : 2,
        overflow: "hidden"
      }}
    >
      {/* MEDIA DISPLAY */}
      {currentMedia.type === "image" ? (
        <img
          src={`http://localhost:5000${currentMedia.url}`}
          alt="post"
          style={{
            width: "100%",
            maxHeight: maxHeight,
            objectFit: "contain",
            display: "block"
          }}
        />
      ) : (
        <Box 
          sx={{ 
            position: "relative",
            "&:hover .video-controls": {
              opacity: 1
            }
          }}
          onMouseEnter={() => setShowControls(prev => ({ ...prev, [videoId]: true }))}
          onMouseLeave={() => setShowControls(prev => ({ ...prev, [videoId]: false }))}
        >
          <video
            ref={(el) => videoRefs.current[videoId] = el}
            src={`http://localhost:5000${currentMedia.url}`}
            style={{
              width: "100%",
              maxHeight: maxHeight,
              objectFit: "contain",
              display: "block",
              backgroundColor: "#000"
            }}
            onTimeUpdate={() => handleTimeUpdate(videoId)}
            onLoadedMetadata={() => handleLoadedMetadata(videoId)}
            onPlay={() => setIsPlaying(prev => ({ ...prev, [videoId]: true }))}
            onPause={() => setIsPlaying(prev => ({ ...prev, [videoId]: false }))}
            onClick={() => handlePlayPause(videoId)}
          />

          {/* Custom Video Controls */}
          <Box
            className="video-controls"
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              p: 2,
              opacity: showControls[videoId] || !isPlaying[videoId] ? 1 : 0,
              transition: "opacity 0.3s ease",
              zIndex: 2
            }}
          >
            {/* Progress Bar */}
            <Slider
              value={progress[videoId] || 0}
              max={duration[videoId] || 100}
              onChange={(e, val) => handleProgressChange(videoId, val)}
              sx={{
                color: "#fff",
                height: 4,
                mb: 1,
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                  transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0 0 0 8px rgba(255,255,255,0.16)"
                  }
                },
                "& .MuiSlider-rail": {
                  opacity: 0.3
                }
              }}
            />

            {/* Control Buttons */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause(videoId);
                }}
                sx={{ color: "#fff" }}
              >
                {isPlaying[videoId] ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
              </IconButton>

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMuteToggle(videoId);
                }}
                sx={{ color: "#fff" }}
              >
                {isMuted[videoId] ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon />}
              </IconButton>

              <Typography variant="caption" sx={{ color: "#fff", mx: 1 }}>
                {formatTime(progress[videoId])} / {formatTime(duration[videoId])}
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen(videoId);
                }}
                sx={{ color: "#fff" }}
              >
                <FullscreenRoundedIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      )}

      {/* NAVIGATION DOTS - Multiple media */}
      {allMedia.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            zIndex: 2
          }}
        >
          {allMedia.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: currentIndex === index ? "#fff" : "rgba(255, 255, 255, 0.5)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  bgcolor: "#fff",
                  transform: "scale(1.2)"
                }
              }}
            />
          ))}
        </Box>
      )}

      {/* NAVIGATION ARROWS - Multiple media */}
      {allMedia.length > 1 && (
        <>
          {currentIndex > 0 && (
            <IconButton
              onClick={() => setCurrentIndex(currentIndex - 1)}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" }
              }}
            >
              ←
            </IconButton>
          )}
          {currentIndex < allMedia.length - 1 && (
            <IconButton
              onClick={() => setCurrentIndex(currentIndex + 1)}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" }
              }}
            >
              →
            </IconButton>
          )}
        </>
      )}
    </Box>
  );
}