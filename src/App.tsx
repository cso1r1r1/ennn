import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Github, Youtube, Calculator, X, User } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  duration: number;
  url: string;
}

function App() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [userIP, setUserIP] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [message, setMessage] = useState('');
  const [messagesSent, setMessagesSent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [visitedIPs, setVisitedIPs] = useState<Set<string>>(new Set());
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const tracks: Track[] = [
    { title: "Hava Naquila", artist: "The Government", duration: 122, url: "https://cdn.discordapp.com/attachments/1237825641236140157/1395400329566355498/Hava_Naquila_Flamman__Abraxas_Radio_Mix.mp3?ex=687a4f53&is=6878fdd3&hm=55ec0a2efa97e39c0c0cfb33baa2b19eed8df77653d1c681ee6009ed6cc65a01&" },
    { title: "Dragostea Din Tei", artist: "O-Zone", duration: 344, url: "https://cdn.discordapp.com/attachments/1237825641236140157/1395377507007598633/O-Zone_-_Dragostea_Din_Tei_lyrics.mp3?ex=687a3a12&is=6878e892&hm=898ac93c84957b63848a4088432881a8453e025bd7eb0e0526223bd63eeb53bc&" },
    { title: "It Was A Good Day", artist: "Ice Cube", duration: 506, url: "https://cdn.discordapp.com/attachments/1237825641236140157/1395378439221149827/Ice_Cube_-_It_Was_A_Good_Day.mp3?ex=687a3af0&is=6878e970&hm=7da1ef43d6294fc3006350dd1e9597ba34a526e2c85f1f16082347bc735d3c8c&" }
  ];

  const hallOfFameImages = [
    "https://media.discordapp.net/attachments/1237825641236140157/1395401617951428628/deletefeelingsosaddepress3ionsosad.jpg?ex=687a5087&is=6878ff07&hm=c7d6bd725d730b128dbfab8adadde4b9f11a9a9a2d8fe01ddd9ee80ab31bc0b5&=&format=webp&width=369&height=656",
    "https://media.discordapp.net/attachments/1237825641236140157/1395401617951428628/deletefeelingsosaddepress3ionsosad.jpg?ex=687a5087&is=6878ff07&hm=c7d6bd725d730b128dbfab8adadde4b9f11a9a9a2d8fe01ddd9ee80ab31bc0b5&=&format=webp&width=369&height=656",
    "https://media.discordapp.net/attachments/1237825641236140157/1395401617951428628/deletefeelingsosaddepress3ionsosad.jpg?ex=687a5087&is=6878ff07&hm=c7d6bd725d730b128dbfab8adadde4b9f11a9a9a2d8fe01ddd9ee80ab31bc0b5&=&format=webp&width=369&height=656",
    "https://media.discordapp.net/attachments/1237825641236140157/1395401617951428628/deletefeelingsosaddepress3ionsosad.jpg?ex=687a5087&is=6878ff07&hm=c7d6bd725d730b128dbfab8adadde4b9f11a9a9a2d8fe01ddd9ee80ab31bc0b5&=&format=webp&width=369&height=656",
    "https://media.discordapp.net/attachments/1237825641236140157/1395401617951428628/deletefeelingsosaddepress3ionsosad.jpg?ex=687a5087&is=6878ff07&hm=c7d6bd725d730b128dbfab8adadde4b9f11a9a9a2d8fe01ddd9ee80ab31bc0b5&=&format=webp&width=369&height=656",
    "https://media.discordapp.net/attachments/1237825641236140157/1395401617951428628/deletefeelingsosaddepress3ionsosad.jpg?ex=687a5087&is=6878ff07&hm=c7d6bd725d730b128dbfab8adadde4b9f11a9a9a2d8fe01ddd9ee80ab31bc0b5&=&format=webp&width=369&height=656",
    "https://media.discordapp.net/attachments/1237825641236140157/1395401617951428628/deletefeelingsosaddepress3ionsosad.jpg?ex=687a5087&is=6878ff07&hm=c7d6bd725d730b128dbfab8adadde4b9f11a9a9a2d8fe01ddd9ee80ab31bc0b5&=&format=webp&width=369&height=656",
    "https://media.discordapp.net/attachments/1237825641236140157/1395401617951428628/deletefeelingsosaddepress3ionsosad.jpg?ex=687a5087&is=6878ff07&hm=c7d6bd725d730b128dbfab8adadde4b9f11a9a9a2d8fe01ddd9ee80ab31bc0b5&=&format=webp&width=369&height=656",
    "https://media.discordapp.net/attachments/1237825641236140157/1395401617951428628/deletefeelingsosaddepress3ionsosad.jpg?ex=687a5087&is=6878ff07&hm=c7d6bd725d730b128dbfab8adadde4b9f11a9a9a2d8fe01ddd9ee80ab31bc0b5&=&format=webp&width=369&height=656"
  ];

  // please dont nuke it:)
  const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1395396335829647533/rUBFzpIfUPGya9B2lwXz9iPGaWZs2-CuqdHbVARqL226-iMHnmQAPiIKcvTUiLOtd7tr';

  const sendDiscordMessage = async (content: string) => {
    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          username: 'Funny',
          avatar_url: 'https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=100'
        }),
      });
    } catch (error) {
      console.error('Failed to send Discord message:', error);
    }
  };

  const getLocationInfo = async (ip: string) => {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    // Fetch user IP and send visitor notification
    const initializeVisitor = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip = ipData.ip || '127.0.0.1';
        setUserIP(ip);

        // Check if IP was already logged in the last 2 minutes
        const ipKey = `visited_${ip}`;
        const lastVisit = localStorage.getItem(ipKey);
        const now = Date.now();
        
        if (!lastVisit || (now - parseInt(lastVisit)) > 120000) { // 2 minutes = 120000ms
          // Get location and browser info
          const locationInfo = await getLocationInfo(ip);
          const browserInfo = navigator.userAgent;
          const referrer = document.referrer || 'Direct visit';
          
          // Send visitor notification to Discord
          const visitorMessage = `🌟 **random mf on your website**
**IP Address:** ${ip}
**Location:** ${locationInfo ? `${locationInfo.city}, ${locationInfo.region}, ${locationInfo.country_name}` : 'Unknown'}
**ISP:** ${locationInfo ? locationInfo.org : 'Unknown'}
**Browser:** ${browserInfo}
**Referrer:** ${referrer}
**Time:** ${new Date().toLocaleString()}`;

          await sendDiscordMessage(visitorMessage);
          
          // Store the current timestamp for this IP
          localStorage.setItem(ipKey, now.toString());
        }
      } catch (error) {
        setUserIP('127.0.0.1');
      }
    };

    initializeVisitor();

    // Show content with fade-in effect
    setTimeout(() => setShowContent(true), 500);
    
    // Auto-start first music after content loads
    setTimeout(() => {
      setIsPlaying(true);
    }, 1500);

    // Add click listener to enable audio on first user interaction (for browsers that block autoplay)
    const enableAudioOnInteraction = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener('click', enableAudioOnInteraction);
    };
    
    document.addEventListener('click', enableAudioOnInteraction);
    
    return () => {
      document.removeEventListener('click', enableAudioOnInteraction);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      const nextTrack = (currentTrack + 1) % tracks.length;
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, tracks.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Auto-play prevented by browser:', error);
        // If auto-play fails, we'll try again on user interaction
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const newTime = (percentage / 100) * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(percentage);
  };

  const handleLogin = () => {
    // Simulate Google login
    setIsLoggedIn(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || messagesSent >= 3 || isLoading) return;

    setIsLoading(true);
    
    const userMessage = `💬 **New Message from Website Visitor**
**IP Address:** ${userIP}
**Message:** ${message}
**Time:** ${new Date().toLocaleString()}`;

    await sendDiscordMessage(userMessage);
    
    setMessagesSent(prev => prev + 1);
    setMessage('');
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openCalculator = () => {
    window.open('calculator://', '_blank');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white text-blue-900 overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%230038A8%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M30 30l15-15v30z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] repeat"></div>
      </div>

      {/* Calculator Button */}
      <button
        onClick={openCalculator}
        className="fixed top-4 left-4 z-50 p-3 bg-blue-900/10 backdrop-blur-sm rounded-lg hover:bg-blue-900/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/50 hover:scale-105 group border-2 border-black"
      >
        <Calculator className="w-6 h-6 text-blue-900 group-hover:text-blue-700 transition-colors" />
      </button>

      {/* IP Address Display */}
      <div className="fixed top-4 right-4 z-50 p-3 bg-blue-900/10 backdrop-blur-sm rounded-lg">
        <span className="text-sm font-medium">Your IP Address: </span>
        <span className="font-mono text-sm bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
          {userIP}
        </span>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}>
        
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
          <div className="text-center space-y-8">
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <video 
                src="https://images-ext-1.discordapp.net/external/54u-JIPNJZk6_O9nlgbaUk1Hbq2H8nr-5nrTPkKGZpw/https/media.tenor.com/UuVRSPZe1YkAAAPo/mrfish-lombakka.mp4" 
                alt="SZEBIALLL Logo"
                className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-lg shadow-lg"
                autoPlay
                loop
                muted
                playsInline
              />
              <img 
                src="https://media.discordapp.net/attachments/1344637930370760736/1395399659350130930/image-removebg-preview_11_1.png?ex=687a4eb4&is=6878fd34&hm=6a0e1e210bb1d03109c2c05cec973afd37d8bd71d50bb82a5857d4bab795bed6&=&format=webp&quality=lossless" 
                alt="SZEBIALLL Character"
                className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-lg shadow-lg"
              />
            </div>
            <p className="text-xl md:text-2xl text-blue-700 max-w-2xl mx-auto">
              My Socials:
            </p>
            
            {/* Social Buttons */}
            <div className="flex gap-6 justify-center mt-12">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-blue-900/10 backdrop-blur-sm rounded-xl hover:bg-blue-900/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/50 hover:scale-110 border-2 border-black"
              >
                <Github className="w-8 h-8 text-blue-900 group-hover:text-blue-700 transition-colors" />
              </a>
              <a
                href="https://www.youtube.com/@olibrokkmeno"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 bg-blue-900/10 backdrop-blur-sm rounded-xl hover:bg-blue-900/20 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 hover:scale-110 border-2 border-black"
              >
                <Youtube className="w-8 h-8 text-blue-900 group-hover:text-red-600 transition-colors" />
              </a>
            </div>
          </div>
        </section>

        {/* Music Playlist Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-blue-700">Favorite Songs:</h2>
            
            <div className="bg-blue-900/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-blue-900/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{tracks[currentTrack].title}</h3>
                  <p className="text-blue-700 text-sm">{tracks[currentTrack].artist}</p>
                </div>
                <button
                  onClick={togglePlayPause}
                  className="p-3 bg-blue-900 hover:bg-blue-800 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-white/50 hover:scale-110 text-white border-2 border-black"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
              </div>

              {/* Progress Bar */}
              <div 
                ref={progressRef}
                className="w-full h-2 bg-blue-900/20 rounded-full cursor-pointer mb-4"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-blue-900 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-blue-700" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-blue-900/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Track List */}
              <div className="mt-6 space-y-2">
                {tracks.map((track, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentTrack(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      index === currentTrack 
                        ? 'bg-blue-900/30 shadow-lg shadow-blue-900/25' 
                        : 'bg-blue-900/5 hover:bg-blue-900/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{track.title}</p>
                        <p className="text-blue-700 text-xs">{track.artist}</p>
                      </div>
                      <span className="text-xs text-blue-700">{formatTime(track.duration)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <audio ref={audioRef} src={tracks[currentTrack].url} />
            </div>
          </div>
        </section>

        {/* Israel Hall of Fame */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-blue-700">Israel Hall of Fame</h2>
            
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {hallOfFameImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className="aspect-square bg-blue-900/10 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-white/25 hover:ring-2 hover:ring-blue-900/50"
                >
                  <img
                    src={image}
                    alt={`Hall of Fame ${index + 1}`}
                    className="w-full h-full object-cover hover:brightness-110 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Login Section */}
        <section className="py-20 px-4">
          <div className="max-w-md mx-auto text-center">
            {!isLoggedIn ? (
              <button
                onClick={handleLogin}
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 border-2 border-black"
              >
                <User className="w-6 h-6 inline mr-2 group-hover:text-blue-300 transition-colors" />
                Wanna be remembered?
              </button>
            ) : (
              <div className="p-6 bg-green-100 backdrop-blur-sm rounded-xl border border-green-300">
                <p className="text-green-800 font-semibold">Authorized!</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold text-center mb-6 text-blue-700">Send me a message!</h3>
            <div className="bg-blue-900/10 backdrop-blur-sm rounded-xl p-6 border-2 border-black">
              <div className="space-y-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full p-3 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-blue-900/30 text-blue-900 placeholder-blue-700/70 resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/50"
                  rows={3}
                  maxLength={500}
                  disabled={messagesSent >= 3 || isLoading}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">
                    Messages left: {3 - messagesSent}
                  </span>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || messagesSent >= 3 || isLoading}
                    className="px-6 py-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-900/50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 border-2 border-black"
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
                {messagesSent >= 3 && (
                  <p className="text-sm text-red-600 text-center">
                    Message limit reached. Refresh the page to send more messages.
                  </p>
                )}
              </div>
            </div>
            <p className="text-center text-blue-700 text-sm mt-4">
              Discord: <span className="font-mono text-blue-900">sourcesh</span>
            </p>
          </div>
        </footer>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110 border-2 border-black"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;