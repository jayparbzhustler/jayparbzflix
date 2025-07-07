import React, { useState } from 'react';
import { Edit, Plus, Trash2, Settings, User } from 'lucide-react';
import { useData } from '../context/DataContext';

const ProfilePage: React.FC = () => {
  const { user, loading } = useData();
  const [selectedProfile, setSelectedProfile] = useState<string>('main');

  // Mock additional profiles
  const profiles = [
    {
      id: 'main',
      name: 'Jay Parbz',
      avatar: '👨‍💼',
      isMain: true,
      preferences: {
        maturity: 'All',
        language: 'English',
        autoplay: true
      }
    },
    {
      id: 'kids',
      name: 'Kids',
      avatar: '🧒',
      isMain: false,
      preferences: {
        maturity: 'Kids & Family',
        language: 'English',
        autoplay: false
      }
    },
    {
      id: 'guest',
      name: 'Guest',
      avatar: '👤',
      isMain: false,
      preferences: {
        maturity: 'Teen',
        language: 'English',
        autoplay: true
      }
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-white text-xl">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Header */}
      <div className="px-4 md:px-8 lg:px-16 py-8">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-8">Manage Profiles</h1>
      </div>

      {/* Profiles Grid */}
      <div className="px-4 md:px-8 lg:px-16 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-4xl">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`text-center cursor-pointer group ${
                selectedProfile === profile.id ? 'ring-2 ring-white rounded-lg' : ''
              }`}
              onClick={() => setSelectedProfile(profile.id)}
            >
              <div className="relative mb-3">
                <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center text-4xl group-hover:bg-gray-600 transition-colors duration-200">
                  {profile.avatar}
                </div>
                {profile.isMain && (
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    Main
                  </div>
                )}
                <button className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Edit size={24} className="text-white" />
                </button>
              </div>
              <p className="text-white text-lg font-medium">{profile.name}</p>
            </div>
          ))}
          
          {/* Add Profile */}
          <div className="text-center cursor-pointer group">
            <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 group-hover:border-gray-400 transition-colors duration-200">
              <Plus size={40} className="text-gray-400 group-hover:text-gray-200" />
            </div>
            <p className="text-gray-400 text-lg font-medium mt-3 group-hover:text-gray-200">Add Profile</p>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      {selectedProfile && (
        <div className="px-4 md:px-8 lg:px-16 mb-12">
          <div className="max-w-4xl">
            <h2 className="text-white text-2xl font-semibold mb-6">
              Profile Settings for {profiles.find(p => p.id === selectedProfile)?.name}
            </h2>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Profile Info */}
                <div>
                  <h3 className="text-white text-lg font-semibold mb-4">Profile Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Profile Name
                      </label>
                      <input
                        type="text"
                        defaultValue={profiles.find(p => p.id === selectedProfile)?.name}
                        className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Profile Picture
                      </label>
                      <div className="flex space-x-3">
                        {['👨‍💼', '👩‍💼', '🧒', '👤', '😀', '🎭', '🎨', '🎮'].map((emoji) => (
                          <button
                            key={emoji}
                            className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xl hover:bg-gray-600 transition-colors duration-200"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-white text-lg font-semibold mb-4">Viewing Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Maturity Rating
                      </label>
                      <select className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-white">
                        <option>Kids & Family</option>
                        <option>Teen</option>
                        <option>All</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Language
                      </label>
                      <select className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-white">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm font-medium">Autoplay Next Episode</span>
                      <button className="bg-red-600 rounded-full w-12 h-6 flex items-center justify-end px-1 transition-all duration-200">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm font-medium">Autoplay Previews</span>
                      <button className="bg-gray-600 rounded-full w-12 h-6 flex items-center justify-start px-1 transition-all duration-200">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                <button className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors duration-200">
                  <Trash2 size={16} />
                  <span>Delete Profile</span>
                </button>
                
                <div className="space-x-4">
                  <button className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors duration-200">
                    Cancel
                  </button>
                  <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors duration-200">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings */}
      <div className="px-4 md:px-8 lg:px-16 pb-20">
        <div className="max-w-4xl">
          <h2 className="text-white text-2xl font-semibold mb-6">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Email</h3>
                <p className="text-gray-400">{user?.email}</p>
              </div>
              <button className="text-white hover:text-gray-300 transition-colors duration-200">
                <Edit size={20} />
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Password</h3>
                <p className="text-gray-400">••••••••</p>
              </div>
              <button className="text-white hover:text-gray-300 transition-colors duration-200">
                <Edit size={20} />
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Plan Details</h3>
                <p className="text-gray-400">Premium Plan - $15.99/month</p>
              </div>
              <button className="text-white hover:text-gray-300 transition-colors duration-200">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
