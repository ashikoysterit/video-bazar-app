import React, { useState, useEffect } from 'react';
import { Play, Lock, Smartphone, CreditCard, X, CheckCircle, Search, Menu, User, Home, Film, Phone, Copy } from 'lucide-react';

// মক ডাটা - ভিডিও লিস্ট
const VIDEO_DATA = [
  {
    id: 1,
    title: "বেসিক ভিডিও এডিটিং কোর্স - পর্ব ১",
    description: "Adobe Premiere Pro দিয়ে ভিডিও এডিটিং শিখুন। একদম নতুনদের জন্য তৈরি সম্পূর্ণ গাইড।",
    price: 50,
    category: "টিউটোরিয়াল",
    thumbnail: "https://placehold.co/600x400/2563eb/white?text=Video+Editing+101",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // ডেমো ভিডিও
    rating: 4.8
  },
  {
    id: 2,
    title: "ফ্রিল্যান্সিং গাইডলাইন ২০২৫",
    description: "কীভাবে ফ্রিল্যান্সিং শুরু করবেন? মার্কেটপ্লেস এবং স্কিল ডেভেলপমেন্ট নিয়ে বিস্তারিত আলোচনা।",
    price: 100,
    category: "ক্যারিয়ার",
    thumbnail: "https://placehold.co/600x400/16a34a/white?text=Freelancing+Guide",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    rating: 4.9
  },
  {
    id: 3,
    title: "এক্সক্লুসিভ বাংলা নাটক - 'শেষ বিকেল'",
    description: "জনপ্রিয় অভিনেতাদের অভিনীত একটি রোমান্টিক এবং ড্রামা ধর্মী স্বল্পদৈর্ঘ্য চলচ্চিত্র।",
    price: 30,
    category: "বিনোদল",
    thumbnail: "https://placehold.co/600x400/dc2626/white?text=Bangla+Natok",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    rating: 4.5
  },
  {
    id: 4,
    title: "ডিজিটাল মার্কেটিং মাস্টারি",
    description: "ফেসবুক এবং গুগল অ্যাডস এর মাধ্যমে কীভাবে ব্যবসা বাড়াবেন তার কৌশল।",
    price: 500,
    category: "মার্কেটিং",
    thumbnail: "https://placehold.co/600x400/d97706/white?text=Digital+Marketing",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    rating: 5.0
  },
  {
    id: 5,
    title: "ওয়েব ডিজাইন ক্র্যাশ কোর্স",
    description: "HTML, CSS এবং Tailwind দিয়ে রেস্পন্সিভ ওয়েবসাইট তৈরি করা শিখুন।",
    price: 250,
    category: "টিউটোরিয়াল",
    thumbnail: "https://placehold.co/600x400/9333ea/white?text=Web+Design",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    rating: 4.7
  },
  {
    id: 6,
    title: "ভৌতিক গল্প - রহস্যময় রাত",
    description: "একটি সত্য ঘটনার ছায়া অবলম্বনে নির্মিত অডিও-ভিজ্যুয়াল হরর স্টোরি।",
    price: 20,
    category: "বিনোদল",
    thumbnail: "https://placehold.co/600x400/000000/white?text=Horror+Story",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    rating: 4.2
  }
];

// পেমেন্ট মেথড কনফিগারেশন
const PAYMENT_METHODS = {
  bkash: {
    name: 'বিকাশ',
    color: 'bg-pink-600',
    hover: 'hover:bg-pink-700',
    number: '01700000000',
    logoText: 'bKash'
  },
  nagad: {
    name: 'নগদ',
    color: 'bg-orange-600',
    hover: 'hover:bg-orange-700',
    number: '01800000000',
    logoText: 'Nagad'
  },
  rocket: {
    name: 'রকেট',
    color: 'bg-purple-600',
    hover: 'hover:bg-purple-700',
    number: '01900000000',
    logoText: 'Rocket'
  }
};

export default function VideoBazarApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [purchasedVideos, setPurchasedVideos] = useState([]); // কেনা ভিডিওর আইডি স্টোর করবে
  const [paymentStep, setPaymentStep] = useState(1); // 1: Method Select, 2: Confirm
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [trxId, setTrxId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(null); // { type: 'success'|'error', message: string }

  // লোড হচ্ছে কি না চেক করে localStorage থেকে কেনা ভিডিও রিস্টোর
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vb_purchased_videos');
      if (raw) {
        setPurchasedVideos(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Failed to parse purchased videos from localStorage', e);
    }
  }, []);

  // purchasedVideos কে localStorage এ persist করা
  useEffect(() => {
    try {
      localStorage.setItem('vb_purchased_videos', JSON.stringify(purchasedVideos));
    } catch (e) {
      console.warn('Failed to save purchased videos to localStorage', e);
    }
  }, [purchasedVideos]);

  // মডাল ওপেন হলে পেজ স্ক্রল বন্ধ ও ESC হ্যান্ডলার
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (showPaymentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevOverflow || '';
    }

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowPaymentModal(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow || '';
    };
  }, [showPaymentModal]);

  // ফিল্টার করা ভিডিও
  const filteredVideos = VIDEO_DATA.filter(video => {
    const matchSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'All' || video.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // ক্যাটাগরি লিস্ট
  const categories = ['All', ...new Set(VIDEO_DATA.map(v => v.category))];

  const handleBuyClick = (video) => {
    // যদি ভিডিওটি ইতিমধ্যে কেনা থাকে
    if (purchasedVideos.includes(video.id)) {
      setSelectedVideo(video);
      setActiveTab('player');
      return;
    }
    setSelectedVideo(video);
    setPaymentStep(1);
    setTrxId('');
    setSelectedMethod(null);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!trxId || !selectedVideo || !selectedMethod) return;

    setIsLoading(true);

    // ফেইক পেমেন্ট ভেরিফিকেশন ডিলে
    setTimeout(() => {
      setIsLoading(false);
      setPurchasedVideos(prev => Array.from(new Set([...prev, selectedVideo.id])));
      setShowPaymentModal(false);
      setActiveTab('player');
      setShowToast({ type: 'success', message: 'পেমেন্ট সফল হয়েছে! আপনার ভিডিওটি আনলক করা হয়েছে।' });
      setTimeout(() => setShowToast(null), 3500);
    }, 1500);
  };

  const playPurchasedVideo = (video) => {
    setSelectedVideo(video);
    setActiveTab('player');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowToast({ type: 'success', message: 'নাম্বার কপি করা হয়েছে' });
      setTimeout(() => setShowToast(null), 2000);
    } catch (e) {
      setShowToast({ type: 'error', message: 'কপি করা যায়নি' });
      setTimeout(() => setShowToast(null), 2000);
    }
  };

  // ----- কম্পোনেন্ট সেকশন -----

  // ১. পেমেন্ট মডাল
  const PaymentModal = () => {
    if (!showPaymentModal || !selectedVideo) return null;

    const methodObj = selectedMethod ? PAYMENT_METHODS[selectedMethod] : null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
        <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 id="payment-modal-title" className="text-lg font-bold text-gray-800">পেমেন্ট করুন</h3>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="text-gray-500 hover:text-red-500"
              aria-label="Close payment modal"
              disabled={isLoading}
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-4 bg-blue-50 p-3 rounded-lg flex items-center gap-3">
              <img src={selectedVideo.thumbnail} alt="thumb" className="w-16 h-12 object-cover rounded" />
              <div>
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">{selectedVideo.title}</p>
                <p className="text-blue-600 font-bold">মূল্য: ৳{selectedVideo.price}</p>
              </div>
            </div>

            {paymentStep === 1 ? (
              <div>
                <p className="text-gray-600 mb-4 text-sm">নিচের যেকোনো একটি মাধ্যম বেছে নিন:</p>
                <div className="space-y-3">
                  {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
                    <button
                      key={key}
                      onClick={() => { setSelectedMethod(key); setPaymentStep(2); }}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 border-transparent hover:border-gray-200 shadow-sm transition-all ${method.color} text-white`}
                    >
                      <span className="font-bold text-lg">{method.name}</span>
                      <span className="bg-white/20 px-3 py-1 rounded text-sm">Pay Now</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit}>
                 <button 
                  type="button" 
                  onClick={() => { setPaymentStep(1); setSelectedMethod(null); }} 
                  className="text-xs text-gray-500 hover:text-blue-600 mb-2 underline"
                >
                  ← অন্য মাধ্যম বেছে নিন
                </button>
                
                {methodObj ? (
                  <>
                    <div className={`p-4 rounded-xl mb-4 text-white ${methodObj.color}`}>
                      <p className="text-sm opacity-90">নিচের নাম্বারে 'Send Money' করুন:</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-mono font-bold my-1 selection:bg-black/30">
                          {methodObj.number}
                        </p>
                        <button type="button" onClick={() => copyToClipboard(methodObj.number)} className="ml-2 text-white/90">
                          <Copy size={18} />
                        </button>
                      </div>
                      <p className="text-xs mt-1 bg-black/20 inline-block px-2 py-0.5 rounded">Personal Account</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">পরিমাণ (টাকা)</label>
                      <input 
                        type="text" 
                        value={selectedVideo.price} 
                        disabled 
                        className="w-full p-3 bg-gray-100 border rounded-lg text-gray-600"
                        aria-disabled="true"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID দিন</label>
                      <input 
                        type="text" 
                        required
                        placeholder="যেমন: 8N7A6D..."
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1">পেমেন্ট কনফার্মেশনের মেসেজ থেকে TrxID টি কপি করে বসান।</p>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full py-3 rounded-xl font-bold text-white transition-all flex justify-center items-center gap-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {isLoading ? 'যাচাই করা হচ্ছে...' : 'পেমেন্ট নিশ্চিত করুন'}
                      {!isLoading && <CheckCircle size={20} />}
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-red-600">কোনো পেমেন্ট মেথড সিলেক্ট করা হয়নি।</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ২. ভিডিও প্লেয়ার পেজ
  const PlayerView = () => {
    if (!selectedVideo) return null;

    return (
      <div className="pb-24 animate-fadeIn">
        <div className="bg-black sticky top-0 z-10 w-full aspect-video flex items-center justify-center">
           {/* এখানে আসল অ্যাপে ভিডিও প্লেয়ার বসবে */}
           <video 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
              src={selectedVideo.videoUrl}
              poster={selectedVideo.thumbnail}
           >
             আপনার ব্রাউজার ভিডিও সাপোর্ট করছে না।
           </video>
        </div>
        
        <div className="p-4 bg-white">
          <h1 className="text-xl font-bold text-gray-800 mb-2">{selectedVideo.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">{selectedVideo.category}</span>
            <span>⭐ {selectedVideo.rating}</span>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">বর্ণনা</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{selectedVideo.description}</p>
          </div>

          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
             <p className="text-green-800 text-sm font-medium flex items-center gap-2">
               <CheckCircle size={16} /> আপনি এই ভিডিওটি সফলভাবে কিনেছেন।
             </p>
          </div>

          <button onClick={() => setActiveTab('home')} className="mt-8 w-full py-3 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50">
            হোম পেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  };

  // ৩. মাই লাইব্রেরি (কেনা ভিডিও)
  const MyLibrary = () => {
    const myVideos = VIDEO_DATA.filter(v => purchasedVideos.includes(v.id));

    if (myVideos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] p-4 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Film className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-700">কোনো ভিডিও কেনা নেই</h3>
          <p className="text-gray-500 text-sm mt-2">আপনি এখনো কোনো ভিডিও কিনেননি। হোম পেজ থেকে পছন্দের ভিডিও কিনুন।</p>
          <button onClick={() => setActiveTab('home')} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full font-medium">
            ব্রাউজ করুন
          </button>
        </div>
      );
    }

    return (
      <div className="p-4 pb-24">
        <h2 className="text-xl font-bold text-gray-800 mb-4">আমার কেনা ভিডিও ({myVideos.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myVideos.map(video => (
            <div key={video.id} onClick={() => playPurchasedVideo(video)} className="flex gap-3 bg-white p-3 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow">
              <div className="relative w-32 h-20 flex-shrink-0">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <Play size={24} className="text-white fill-current" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">{video.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{video.category}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">দেখুন</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ৪. হোম পেজ (ভিডিও তালিকা)
  const HomeView = () => (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-b-3xl shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Play size={20} className="fill-white" />
            </div>
            <h1 className="text-xl font-bold">ভিডিও বিডি</h1>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <User size={20} />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">শিখুন এবং উপভোগ করুন</h2>
        <p className="text-blue-100 text-sm mb-4">সেরা টিউটোরিয়াল এবং বিনোদনমূলক ভিডিওর কালেকশন।</p>
        
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="ভিডিও খুঁজুন..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 px-4 pl-10 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium mr-2 transition-colors ${
              filterCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border'
            }`}
          >
            {cat === 'All' ? 'সব' : cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map(video => {
          const isPurchased = purchasedVideos.includes(video.id);
          
          return (
            <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="relative aspect-video">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                {!isPurchased && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                    <Lock className="text-white/80" size={32} />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {isPurchased ? 'কেনা হয়েছে' : `৳${video.price}`}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{video.category}</span>
                  <span className="text-xs text-gray-500 flex items-center">⭐ {video.rating}</span>
                </div>
                
                <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{video.description}</p>
                
                <button 
                  onClick={() => handleBuyClick(video)}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                    isPurchased 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isPurchased ? (
                    <>
                      <Play size={16} className="fill-current" /> এখনই দেখুন
                    </>
                  ) : (
                    <>
                       ভিডিও কিনুন
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // মেইন রেন্ডার
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* টোস্ট */}
      {showToast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-white ${showToast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {showToast.message}
        </div>
      )}

      {/* পেজ কন্টেন্ট */}
      <div className="max-w-3xl mx-auto bg-white min-h-screen shadow-2xl relative">
        
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'library' && <MyLibrary />}
        {activeTab === 'player' && <PlayerView />}

        {/* বটম নেভিগেশন বার (মোবাইল) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-6 flex justify-around items-center z-40 max-w-3xl mx-auto shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">হোম</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'library' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Film size={24} strokeWidth={activeTab === 'library' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">লাইব্রেরি</span>
          </button>

          <button className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-400 hover:text-gray-600">
            <Phone size={24} />
            <span className="text-[10px] font-medium">সাপোর্ট</span>
          </button>
        </div>

        {/* মডাল */}
        <PaymentModal />
      
      </div>
    </div>
  );
}