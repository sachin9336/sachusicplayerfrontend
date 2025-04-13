import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2 } from "react-icons/fi";

function Home() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(new Audio());
  const progressRef = useRef(null);
  const location = useLocation();

  // Fetch songs from backend
  useEffect(() => {
    fetch("https://sachusicplayer.onrender.com/api/songs")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Handle search from navbar
  useEffect(() => {
    if (songs.length === 0) return;

    const queryParams = new URLSearchParams(location.search);
    const songIdFromSearch = queryParams.get("song");

    if (songIdFromSearch) {
      const index = songs.findIndex((song) => song._id === songIdFromSearch);
      if (index !== -1) {
        playSong(index);
      }
    }
  }, [songs, location.search]);

  // Handle current song load and play
  useEffect(() => {
    if (currentSongIndex === null || songs.length === 0) return;

    const song = songs[currentSongIndex];
    const songUrl = song.songUrl || song.audioUrl;
    if (!songUrl) return;

    audioRef.current.pause();
    audioRef.current.src = songUrl;
    audioRef.current.volume = volume;
    setLoading(true);

    audioRef.current.oncanplaythrough = () => {
      setLoading(false);
      audioRef.current.play().then(() => setIsPlaying(true));
    };

    audioRef.current.ontimeupdate = () => {
      setCurrentTime(audioRef.current.currentTime);
      if (progressRef.current) {
        progressRef.current.value =
          (audioRef.current.currentTime / audioRef.current.duration) * 100;
      }
    };

    audioRef.current.onended = playNext;
  }, [currentSongIndex]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const changeVolume = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const playNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const playPrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-md mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          MelodyStream
        </motion.h1>

        {/* Loading state */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-8"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && songs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            No songs available
          </motion.div>
        )}

        {/* Songs list */}
        <motion.ul className="space-y-3 mb-8">
          {songs.map((song, index) => (
            <motion.li
              key={song._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${currentSongIndex === index ? 'bg-gray-700 bg-opacity-50' : 'hover:bg-gray-800 hover:bg-opacity-50'}`}
              onClick={() => playSong(index)}
            >
              <div className="relative">
                <img
                  src={song.coverImage || song.imageUrl}
                  alt={song.title}
                  className="w-14 h-14 rounded-md object-cover"
                />
                {currentSongIndex === index && isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
                    <div className="flex space-x-1">
                      <div className="w-1 h-3 bg-purple-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-4 bg-purple-400 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-2 bg-purple-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{song.title}</p>
                <p className="text-xs text-gray-400 truncate">{song.artist}</p>
              </div>
              <button className="ml-2 p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors">
                {currentSongIndex === index && isPlaying ? (
                  <FiPause className="text-white" />
                ) : (
                  <FiPlay className="text-white" />
                )}
              </button>
            </motion.li>
          ))}
        </motion.ul>

        {/* Player controls */}
        {currentSongIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-4 px-6"
          >
            <div className="max-w-md mx-auto">
              <div className="flex items-center mb-3">
                <img
                  src={songs[currentSongIndex].coverImage || songs[currentSongIndex].imageUrl}
                  alt={songs[currentSongIndex].title}
                  className="w-12 h-12 rounded-md object-cover mr-3"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{songs[currentSongIndex].title}</p>
                  <p className="text-xs text-gray-400 truncate">{songs[currentSongIndex].artist}</p>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setIsVolumeOpen(!isVolumeOpen)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FiVolume2 />
                  </button>
                  <AnimatePresence>
                    {isVolumeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 bg-gray-700 p-3 rounded-lg shadow-lg"
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={changeVolume}
                          className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(audioRef.current.duration || 0)}</span>
              </div>

              <input
                ref={progressRef}
                type="range"
                min="0"
                max="100"
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-4"
                onChange={(e) => {
                  audioRef.current.currentTime = (e.target.value / 100) * audioRef.current.duration;
                }}
              />

              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={playPrevious}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiSkipBack size={24} />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <FiPause size={24} className="text-white" />
                  ) : (
                    <FiPlay size={24} className="text-white" />
                  )}
                </button>
                <button
                  onClick={playNext}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiSkipForward size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home;
